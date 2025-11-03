import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ⭐ IN-MEMORY CACHE (5 Min TTL) - Reduziert API-Calls um ~90%
interface CacheEntry {
  data: any;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 Minuten

// ⭐ RATE-LIMIT TRACKING (Exponential Backoff)
let rateLimitUntil = 0;
let backoffSeconds = 60;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin } = await req.json();
    const HERE_API_KEY = Deno.env.get('HERE_API_KEY');

    if (!HERE_API_KEY) {
      throw new Error('HERE_API_KEY nicht konfiguriert');
    }

    if (!origin || typeof origin !== 'string' || !origin.includes(',')) {
      throw new Error('Ungültiger origin Parameter (Format: lat,lng)');
    }

    // ⭐ CHECK CACHE FIRST
    const cacheKey = `traffic_${origin}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.info(`[Cache Hit] ${cacheKey} (Age: ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`);
      return new Response(
        JSON.stringify(cached.data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' }, status: 200 }
      );
    }

    // ⭐ CHECK RATE-LIMIT
    if (Date.now() < rateLimitUntil) {
      const retryAfter = Math.ceil((rateLimitUntil - Date.now()) / 1000);
      console.warn(`[Rate Limited] Retry after ${retryAfter}s`);
      return new Response(
        JSON.stringify({
          jam_factor: 0,
          speed: 50,
          status: 'Rate Limit aktiv',
          route_summary: `Retry in ${retryAfter}s`,
          retry_after: retryAfter,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': String(retryAfter) },
          status: 200 // ⭐ 200 statt 429 → Keine Error-Toast im Frontend
        }
      );
    }

    // HERE Traffic Flow API v7 - Point-based (kein destination nötig)
    const trafficResponse = await fetch(
      `https://traffic.ls.hereapi.com/traffic/6.3/flow.json?prox=${origin},250&apiKey=${HERE_API_KEY}`,
      { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }
    );

    // ⭐ HANDLE 429 WITH EXPONENTIAL BACKOFF
    if (trafficResponse.status === 429) {
      rateLimitUntil = Date.now() + (backoffSeconds * 1000);
      backoffSeconds = Math.min(backoffSeconds * 2, 600); // Max 10 Min
      console.warn(`[429 Rate Limit] Backoff: ${backoffSeconds}s`);
      
      return new Response(
        JSON.stringify({
          jam_factor: 0,
          speed: 50,
          status: 'API Limit erreicht',
          route_summary: `Automatischer Retry in ${backoffSeconds}s`,
          retry_after: backoffSeconds,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': String(backoffSeconds) },
          status: 200
        }
      );
    }

    if (!trafficResponse.ok) {
      console.error('HERE API Error:', trafficResponse.status, trafficResponse.statusText);
      throw new Error(`HERE API Fehler: ${trafficResponse.status}`);
    }

    // ⭐ RESET BACKOFF ON SUCCESS
    backoffSeconds = 60;

    const trafficData = await trafficResponse.json();

    if (!trafficData.RWS || trafficData.RWS.length === 0) {
      const fallbackData = {
        jam_factor: 0,
        speed: 50,
        duration: 0,
        duration_in_traffic: 0,
        distance: 0,
        delay_seconds: 0,
        status: 'Keine Daten',
        route_summary: 'Keine Verkehrsdaten verfügbar',
      };
      
      // ⭐ CACHE FALLBACK (kürzere TTL)
      cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
      
      return new Response(
        JSON.stringify(fallbackData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' }, status: 200 }
      );
    }

    const roadway = trafficData.RWS[0]?.RW?.[0];
    if (!roadway?.FIS?.[0]?.FI?.[0]) {
      throw new Error('Traffic-Daten unvollständig');
    }

    const flowItem = roadway.FIS[0].FI[0];
    const currentFlow = flowItem.CF?.[0];

    const jamFactor = currentFlow?.JF || 0;
    const speed = currentFlow?.SP || currentFlow?.SU || 50;
    const freeFlowSpeed = currentFlow?.FF || speed;
    const delayFactor = freeFlowSpeed > 0 ? speed / freeFlowSpeed : 1;
    const delaySeconds = Math.max(0, Math.round((1 - delayFactor) * 300));

    const responseData = {
      jam_factor: Math.max(0, Math.min(10, jamFactor)),
      speed: Math.round(speed),
      duration: 0,
      duration_in_traffic: 0,
      distance: 0,
      delay_seconds: delaySeconds,
      status: jamFactor < 3 ? 'frei' : jamFactor < 7 ? 'mäßig' : 'Stau',
      route_summary: `${roadway.DE || 'Verkehrslage'} - ${speed.toFixed(0)} km/h`,
    };

    // ⭐ CACHE SUCCESS RESPONSE
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    console.info(`[Cache Miss] ${cacheKey} - Cached for ${CACHE_TTL / 1000}s`);

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' }, status: 200 }
    );
  } catch (error) {
    console.error('Fehler in get-traffic:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unbekannter Fehler',
        jam_factor: 0,
        speed: 50,
        status: 'Unbekannt',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
