import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, at } = await req.json();
    const HERE_API_KEY = Deno.env.get("HERE_API_KEY");

    if (!HERE_API_KEY) {
      throw new Error("HERE_API_KEY nicht konfiguriert");
    }

    if (!query || query.length < 3) {
      return new Response(JSON.stringify({ suggestions: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // HERE Autosuggest API
    // at: Optional, falls wir Firmenstandort kennen (z.B. "48.1351,11.5820" für München)
    const baseUrl = "https://autosuggest.search.hereapi.com/v1/autosuggest";
    const params = new URLSearchParams({
      q: query,
      at: at || "51.1657,10.4515", // Default: Deutschland Zentrum
      limit: "10",
      lang: "de-DE",
      in: "countryCode:DEU,AUT,CHE", // Deutschland, Österreich, Schweiz
      resultTypes: "address",
      apiKey: HERE_API_KEY,
    });

    const autosuggestResponse = await fetch(`${baseUrl}?${params}`);
    const autosuggestData = await autosuggestResponse.json();

    if (!autosuggestData.items || autosuggestData.items.length === 0) {
      return new Response(JSON.stringify({ suggestions: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Transformiere HERE Format zu einheitlichem Format
    const suggestions = autosuggestData.items
      .filter((item: any) => item.resultType === "address")
      .map((item: any) => {
        const addr = item.address;
        return {
          id: item.id,
          title: item.title,
          address: {
            street: addr.street || "",
            house_number: addr.houseNumber || "",
            postal_code: addr.postalCode || "",
            city: addr.city || "",
            country: addr.countryName || "",
          },
          position: item.position || null,
          highlights: item.highlights || {},
        };
      });

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Fehler in here-autosuggest:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        suggestions: [],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
