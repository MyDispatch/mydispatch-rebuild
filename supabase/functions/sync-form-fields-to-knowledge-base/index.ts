import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncRequest {
  force_refresh?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { force_refresh = false }: SyncRequest = await req.json();

    console.log('📋 Starting Form Fields Knowledge-Base Sync...');
    console.log(`Force Refresh: ${force_refresh}`);

    // Delete existing entries if force_refresh
    if (force_refresh) {
      const { error: deleteError } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('category', 'form_field_definition');

      if (deleteError) {
        console.error('Error deleting old entries:', deleteError);
      } else {
        console.log('✅ Deleted old form field entries');
      }
    }

    // Form Fields Registry Structure (from src/config/form-fields-registry.ts)
    const formFieldsDefinitions = [
      {
        entity: 'bookings',
        field_count: 48,
        categories: ['customer', 'datetime', 'addresses', 'flight_details', 'train_details', 'partner', 'disposition', 'payment'],
        fields: {
          customer_id: { label: 'Kunde', type: 'select', required: true },
          pickup_date: { label: 'Abholdatum', type: 'date', required: true },
          pickup_time: { label: 'Abholzeit', type: 'text', required: true },
          pickup_street: { label: 'Abholstraße', type: 'text', required: true },
          dropoff_street: { label: 'Zielstraße', type: 'text', required: true },
          passengers: { label: 'Anzahl Passagiere', type: 'number', required: true },
          vehicle_type: { label: 'Fahrzeugklasse', type: 'select', required: true },
          price: { label: 'Preis (€)', type: 'number', required: true },
          status: { label: 'Status', type: 'select', required: true },
          payment_method: { label: 'Zahlungsart', type: 'select', required: true },
        },
      },
      {
        entity: 'customers',
        field_count: 18,
        categories: ['person', 'address', 'business', 'portal'],
        fields: {
          salutation: { label: 'Anrede', type: 'select', required: true },
          first_name: { label: 'Vorname', type: 'text', required: true },
          last_name: { label: 'Nachname', type: 'text', required: true },
          email: { label: 'E-Mail', type: 'email', required: true },
          phone: { label: 'Telefon', type: 'tel', required: true },
          street: { label: 'Straße', type: 'text', required: true },
          postal_code: { label: 'PLZ', type: 'text', required: true },
          city: { label: 'Stadt', type: 'text', required: true },
        },
      },
      {
        entity: 'drivers',
        field_count: 22,
        categories: ['person', 'employment', 'documents', 'vehicle'],
        fields: {
          salutation: { label: 'Anrede', type: 'select', required: true },
          first_name: { label: 'Vorname', type: 'text', required: true },
          last_name: { label: 'Nachname', type: 'text', required: true },
          birth_date: { label: 'Geburtsdatum', type: 'date', required: true },
          license_number: { label: 'Führerscheinnummer', type: 'text', required: true },
          license_expiry: { label: 'Führerschein gültig bis', type: 'date', required: true },
        },
      },
      {
        entity: 'vehicles',
        field_count: 10,
        categories: ['basic', 'registration', 'insurance'],
        fields: {
          license_plate: { label: 'Kennzeichen', type: 'text', required: true },
          brand: { label: 'Marke', type: 'text', required: true },
          model: { label: 'Modell', type: 'text', required: true },
          vehicle_class: { label: 'Fahrzeugklasse', type: 'select', required: true },
        },
      },
    ];

    const knowledgeEntries = formFieldsDefinitions.map((def) => ({
      category: 'form_field_definition',
      title: `Form Fields: ${def.entity}`,
      content: {
        entity: def.entity,
        field_count: def.field_count,
        categories: def.categories,
        sample_fields: def.fields,
        source_file: 'src/config/form-fields-registry.ts',
        usage: `import { ${def.entity.toUpperCase()}_FIELDS } from '@/config/form-fields-registry';`,
      },
      tags: ['forms', 'fields', 'registry', def.entity],
      source: 'docs_sync',
      confidence_score: 1.0,
    }));

    // Insert into knowledge_base
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(knowledgeEntries)
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Synced ${data.length} form field definitions`);

    // Log sync action
    await supabase.from('ai_actions_log').insert({
      action_type: 'knowledge_sync',
      task_description: 'Sync Form Fields to Knowledge Base',
      success: true,
      metadata: {
        synced_count: data.length,
        force_refresh,
        source: 'form-fields-registry.ts',
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        synced: data.length,
        message: 'Form fields synced successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error syncing form fields:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
