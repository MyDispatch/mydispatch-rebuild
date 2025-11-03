import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Request Body:', JSON.stringify(requestBody));
    
    const city = requestBody?.city || 'München';
    console.log('City Parameter:', city);
    
    const HERE_API_KEY = Deno.env.get('HERE_API_KEY');

    if (!HERE_API_KEY) {
      throw new Error('HERE_API_KEY nicht konfiguriert');
    }

    if (!city || typeof city !== 'string' || city.trim() === '') {
      throw new Error(`Ungültiger city Parameter: ${JSON.stringify(city)}`);
    }

    // HERE Geocoding API für Koordinaten (Migration von Google → HERE)
    const geocodeResponse = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(city)},Germany&apiKey=${HERE_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!geocodeResponse.ok) {
      console.error('HERE Geocoding Error:', geocodeResponse.status);
      throw new Error(`HERE Geocoding Fehler: ${geocodeResponse.status}`);
    }

    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.items || geocodeData.items.length === 0) {
      throw new Error('Stadt nicht gefunden');
    }

    const { lat, lng } = geocodeData.items[0].position;

    // OpenWeatherMap API für Wetterdaten
    const OPENWEATHERMAP_API_KEY = Deno.env.get('OPENWEATHERMAP_API_KEY');
    
    if (!OPENWEATHERMAP_API_KEY) {
      throw new Error('OPENWEATHERMAP_API_KEY nicht konfiguriert');
    }

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=de&appid=${OPENWEATHERMAP_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!weatherResponse.ok) {
      console.error('OpenWeatherMap Error:', weatherResponse.status);
      throw new Error(`OpenWeatherMap Fehler: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    if (!weatherData || !weatherData.main || !weatherData.weather) {
      throw new Error('Unvollständige Wetterdaten');
    }

    return new Response(
      JSON.stringify({
        temp: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        location: city,
        humidity: weatherData.main.humidity,
        wind_speed: Math.round((weatherData.wind?.speed || 0) * 3.6), // m/s → km/h
        pressure: weatherData.main?.pressure || null,
        visibility: weatherData.visibility || null,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Fehler in get-weather:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unbekannter Fehler',
        temp: 15,
        description: 'Fehler beim Laden der Wetterdaten',
        icon: '01d',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
