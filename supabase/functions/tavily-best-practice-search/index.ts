import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TavilySearchRequest {
  query: string;
  search_depth?: 'basic' | 'advanced';
  include_domains?: string[];
  max_results?: number;
}

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, search_depth = 'advanced', include_domains = [], max_results = 5 } = await req.json() as TavilySearchRequest;

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔍 Tavily Search: "${query}" (depth: ${search_depth}, max: ${max_results})`);

    // Validate environment variables
    const TAVILY_API_KEY = Deno.env.get('TAVILY_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('🔍 Environment Check:', {
      hasTavilyKey: !!TAVILY_API_KEY,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey
    });

    if (!TAVILY_API_KEY) {
      console.error('❌ TAVILY_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: TAVILY_API_KEY not configured',
          results: [],
          total: 0
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing Supabase credentials',
          results: [],
          total: 0
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Tavily API Call (Direct API)
    const tavilyPayload: any = {
      query,
      search_depth,
      max_results,
      include_answer: true,
      include_raw_content: false,
    };

    if (include_domains.length > 0) {
      tavilyPayload.include_domains = include_domains;
    }

    console.log('📡 Calling Tavily API...');
    const tavilyResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TAVILY_API_KEY}`,
      },
      body: JSON.stringify(tavilyPayload),
    });

    if (!tavilyResponse.ok) {
      const errorText = await tavilyResponse.text();
      console.error('❌ Tavily API Error:', tavilyResponse.status, errorText);
      throw new Error(`Tavily API error: ${tavilyResponse.status}`);
    }

    const tavilyData = await tavilyResponse.json();
    console.log(`✅ Tavily returned ${tavilyData.results?.length || 0} results`);

    // Parse results
    const results: TavilyResult[] = (tavilyData.results || []).map((result: any) => ({
      title: result.title,
      url: result.url,
      content: result.content,
      score: result.score,
      published_date: result.published_date,
    }));

    // Log to Supabase (optional analytics) - already validated above
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('brain_query_logs').insert({
      query_type: 'tavily_search',
      query_text: query,
      results_count: results.length,
      metadata: { search_depth, max_results, include_domains },
    });

    return new Response(
      JSON.stringify({
        query,
        answer: tavilyData.answer || null,
        results,
        total: results.length,
        search_depth,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in tavily-best-practice-search:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        results: [],
        total: 0,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
