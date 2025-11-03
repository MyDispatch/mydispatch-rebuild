import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExportRequest {
  userId: string;
  categories: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, categories }: ExportRequest = await req.json();

    if (!userId) {
      throw new Error("User ID is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const exportData: Record<string, any> = {
      export_date: new Date().toISOString(),
      user_id: userId,
      categories: {},
    };

    // Helper: Fetch data from table
    const fetchTableData = async (table: string, userIdField = 'user_id') => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(userIdField, userId);

      if (error) {
        console.error(`Error fetching ${table}:`, error);
        return [];
      }
      return data || [];
    };

    // 1. PROFILE & ACCOUNT
    if (categories.includes('profile')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      exportData.categories.profile = {
        description: 'Profil & Account-Daten',
        data: profile || {}
      };
    }

    // 2. BOOKINGS
    if (categories.includes('bookings')) {
      const bookings = await fetchTableData('bookings');
      exportData.categories.bookings = {
        description: 'Aufträge & Buchungen',
        count: bookings.length,
        data: bookings
      };
    }

    // 3. INVOICES
    if (categories.includes('invoices')) {
      const invoices = await fetchTableData('invoices');
      exportData.categories.invoices = {
        description: 'Rechnungen',
        count: invoices.length,
        data: invoices
      };
    }

    // 4. CUSTOMERS
    if (categories.includes('customers')) {
      // Nur Kunden der Company des Users
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userId)
        .single();

      if (profile?.company_id) {
        const { data: customers } = await supabase
          .from('customers')
          .select('*')
          .eq('company_id', profile.company_id);

        exportData.categories.customers = {
          description: 'Kundendaten (Ihres Unternehmens)',
          count: customers?.length || 0,
          data: customers || []
        };
      }
    }

    // 5. DRIVERS
    if (categories.includes('drivers')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userId)
        .single();

      if (profile?.company_id) {
        const { data: drivers } = await supabase
          .from('drivers')
          .select('*')
          .eq('company_id', profile.company_id);

        exportData.categories.drivers = {
          description: 'Fahrerdaten (Ihres Unternehmens)',
          count: drivers?.length || 0,
          data: drivers || []
        };
      }
    }

    // 6. VEHICLES
    if (categories.includes('vehicles')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userId)
        .single();

      if (profile?.company_id) {
        const { data: vehicles } = await supabase
          .from('vehicles')
          .select('*')
          .eq('company_id', profile.company_id);

        exportData.categories.vehicles = {
          description: 'Fahrzeugdaten (Ihres Unternehmens)',
          count: vehicles?.length || 0,
          data: vehicles || []
        };
      }
    }

    // 7. DOCUMENTS
    if (categories.includes('documents')) {
      const documents = await fetchTableData('documents');
      exportData.categories.documents = {
        description: 'Hochgeladene Dokumente',
        count: documents.length,
        data: documents
      };
    }

    // 8. AUDIT LOGS
    if (categories.includes('audit')) {
      const auditLogs = await fetchTableData('audit_logs');
      exportData.categories.audit_logs = {
        description: 'Aktivitätsprotokolle (DSGVO Art. 15)',
        count: auditLogs.length,
        data: auditLogs
      };
    }

    // DSGVO-Metadaten
    exportData.legal_notice = {
      dsgvo_article: 'Art. 20 (Recht auf Datenübertragbarkeit)',
      generated_by: 'MyDispatch DSGVO-Export-System',
      format: 'JSON (maschinenlesbar)',
      retention_period: 'Daten werden nach Export nicht gelöscht (siehe Datenschutzerklärung)',
    };

    return new Response(
      JSON.stringify(exportData, null, 2),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Data Export Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
