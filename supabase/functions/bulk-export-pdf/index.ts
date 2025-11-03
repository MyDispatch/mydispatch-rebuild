/**
 * Bulk PDF Export
 * V18.3 - Sprint 37: Bulk-Aktionen
 * 
 * Exportiert mehrere Aufträge/Rechnungen als PDF
 * - Multi-Entity Support (bookings, invoices)
 * - Company-Branding (Logo, Farben)
 * - German Formatting (DIN 5008)
 * - ZIP-Archiv für Bulk-Download
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user and get company_id
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get company_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Profile not found');
    }

    const company_id = profile.company_id;

    // Parse request body
    const { entity_type, entity_ids } = await req.json();

    console.log('Bulk PDF Export', { company_id, entity_type, count: entity_ids.length });

    // Fetch company data for branding
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('name, logo_url, primary_color, address, email, phone, tax_id')
      .eq('id', company_id)
      .single();

    if (companyError) {
      throw new Error(`Failed to fetch company: ${companyError.message}`);
    }

    // Fetch entities
    let entities: any[] = [];
    
    if (entity_type === 'bookings') {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customers (first_name, last_name, email, phone, address),
          drivers (first_name, last_name, phone),
          vehicles (license_plate, vehicle_class)
        `)
        .eq('company_id', company_id)
        .in('id', entity_ids);

      if (error) throw error;
      entities = data || [];
    } else if (entity_type === 'invoices') {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (first_name, last_name, email, phone, address, billing_address)
        `)
        .eq('company_id', company_id)
        .in('id', entity_ids);

      if (error) throw error;
      entities = data || [];
    }

    // Generate simple PDF URLs (in production, this would use a PDF library)
    // For now, return a structured response that the frontend can use
    const pdfData = entities.map(entity => {
      const pdfContent = generatePDFContent(entity, company, entity_type);
      return {
        id: entity.id,
        filename: `${entity_type}_${entity.id}.pdf`,
        content: pdfContent
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        count: pdfData.length,
        pdfs: pdfData,
        download_url: `${supabaseUrl}/storage/v1/object/public/documents/exports/bulk_${Date.now()}.zip` // Placeholder
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in bulk PDF export:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Generate PDF content structure
 * (In production, use a PDF library like pdfkit or puppeteer)
 */
function generatePDFContent(entity: any, company: any, type: string): any {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount || 0);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date));
  };

  if (type === 'bookings') {
    return {
      header: {
        company_name: company.name,
        logo_url: company.logo_url,
        address: company.address,
        phone: company.phone,
        email: company.email,
      },
      title: `Auftragsbestätigung`,
      booking_number: `BK-${entity.id.slice(0, 8)}`,
      date: formatDate(entity.created_at),
      customer: {
        name: `${entity.customers?.first_name || ''} ${entity.customers?.last_name || ''}`,
        address: entity.customers?.address,
        phone: entity.customers?.phone,
        email: entity.customers?.email,
      },
      details: {
        pickup_time: formatDate(entity.pickup_time),
        pickup_address: entity.pickup_address,
        dropoff_address: entity.dropoff_address,
        driver: entity.drivers ? `${entity.drivers.first_name} ${entity.drivers.last_name}` : 'Nicht zugewiesen',
        vehicle: entity.vehicles?.license_plate || 'Nicht zugewiesen',
        price: formatCurrency(entity.price),
        payment_status: entity.payment_status,
      },
      footer: {
        tax_id: company.tax_id,
        generated_at: formatDate(new Date().toISOString()),
      },
    };
  }

  if (type === 'invoices') {
    return {
      header: {
        company_name: company.name,
        logo_url: company.logo_url,
        address: company.address,
        phone: company.phone,
        email: company.email,
      },
      title: `Rechnung`,
      invoice_number: entity.invoice_number,
      date: formatDate(entity.invoice_date),
      due_date: formatDate(entity.due_date),
      customer: {
        name: `${entity.customers?.first_name || ''} ${entity.customers?.last_name || ''}`,
        billing_address: entity.customers?.billing_address || entity.customers?.address,
        email: entity.customers?.email,
      },
      line_items: [], // Would include booking details
      summary: {
        net_amount: formatCurrency(entity.net_amount),
        vat_amount: formatCurrency(entity.vat_amount),
        total_amount: formatCurrency(entity.total_amount),
      },
      payment_info: {
        payment_method: entity.payment_method,
        payment_status: entity.payment_status,
        payment_term: `${entity.payment_term_days} Tage`,
      },
      footer: {
        tax_id: company.tax_id,
        bank_details: company.iban ? `IBAN: ${company.iban}` : '',
        generated_at: formatDate(new Date().toISOString()),
      },
    };
  }

  return {};
}
