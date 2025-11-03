import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { graphicType, theme, elements, style } = await req.json();

    // Build prompt based on graphic type
    const prompt = `Generate a premium, professional ${graphicType} graphic for a taxi/rideshare platform.

Theme: ${theme}
Elements: ${elements.join(', ')}
Style: ${style}

Design Guidelines:
- V28.1 Slate color palette: 
  * slate-900 (#0f172a) - Primary text and strong elements
  * slate-700 (#334155) - Secondary text and medium elements
  * slate-600 (#475569) - Tertiary elements
  * slate-200 (#e2e8f0) - Backgrounds and light elements
- Flat Design 2.0: Modern, minimalist, professional
- No gradients, no 3D effects, no shadows
- Trust-building aesthetic (B2B quality level)
- Clean lines and geometric shapes

Technical Requirements:
- Format: SVG
- Dimensions: 1200x800px (3:2 aspect ratio)
- Optimized: < 100kb
- Quality: Premium B2B illustration level
- Professional, not cartoonish

Please provide the complete, production-ready SVG code with proper viewBox and dimensions.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Claude API request failed', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const svgContent = data.content[0].text;

    // Extract SVG if wrapped in markdown code blocks
    let cleanedSvg = svgContent;
    if (svgContent.includes('```svg')) {
      const match = svgContent.match(/```svg\n([\s\S]*?)\n```/);
      if (match) {
        cleanedSvg = match[1];
      }
    } else if (svgContent.includes('```')) {
      const match = svgContent.match(/```\n([\s\S]*?)\n```/);
      if (match) {
        cleanedSvg = match[1];
      }
    }

    return new Response(
      JSON.stringify({ 
        svg: cleanedSvg,
        graphicType,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-premium-graphics:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
