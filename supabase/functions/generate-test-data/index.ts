/* ==================================================================================
   TEST-DATEN GENERATOR - Für Entwicklung & Demo
   ==================================================================================
   - Generiert realistische GPS-Positionen
   - Erstellt Chat-Nachrichten
   - Füllt Calls-Tabelle
   - Nur für Master-Accounts zugänglich
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MASTER_EMAILS = ['info@simsek.cc', 'nexify.login@gmail.com'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Auth-Check: Nur Master-Accounts
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user || !MASTER_EMAILS.includes(user.email || '')) {
      return new Response(JSON.stringify({ error: 'Forbidden - Master account required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Generating test data...');

    // 1. GPS-Positionen generieren
    const gpsPositions = [];
    const { data: vehicles } = await supabase.from('vehicles').select('id, company_id, assigned_driver_id').limit(5);
    
    if (vehicles && vehicles.length > 0) {
      // München-Koordinaten als Basis
      const baseLat = 48.1351;
      const baseLng = 11.5820;
      
      for (const vehicle of vehicles) {
        // Generiere 10 Positionen pro Fahrzeug (letzte 2 Stunden)
        for (let i = 0; i < 10; i++) {
          const timestamp = new Date();
          timestamp.setMinutes(timestamp.getMinutes() - (i * 12)); // Alle 12 Minuten
          
          gpsPositions.push({
            vehicle_id: vehicle.id,
            driver_id: vehicle.assigned_driver_id,
            latitude: baseLat + (Math.random() - 0.5) * 0.1, // ±5.5km
            longitude: baseLng + (Math.random() - 0.5) * 0.1,
            speed: Math.random() * 60, // 0-60 km/h
            heading: Math.random() * 360,
            company_id: vehicle.company_id,
            timestamp: timestamp.toISOString()
          });
        }
      }

      const { error: gpsError } = await supabase.from('vehicle_positions').insert(gpsPositions);
      if (gpsError) {
        console.error('GPS insert error:', gpsError);
      } else {
        console.log(`Inserted ${gpsPositions.length} GPS positions`);
      }
    }

    // 2. Chat-Nachrichten generieren
    const { data: conversations } = await supabase.from('chat_conversations').select('id, company_id').limit(3);
    const chatMessages = [];

    if (conversations && conversations.length > 0) {
      const sampleMessages = [
        'Hallo, wie geht es?',
        'Der Kunde ist in 5 Minuten da',
        'Bitte zum Flughafen fahren',
        'Alles klar, bin unterwegs',
        'Stau auf der A9, nehme Umleitung',
        'Auftrag abgeschlossen',
        'Danke für die Info!',
        'Nächste Schicht um 14 Uhr',
        'Fahrzeug muss zur Werkstatt',
        'OK, notiert'
      ];

      for (const conv of conversations) {
        const { data: participants } = await supabase
          .from('chat_participants')
          .select('user_id')
          .eq('conversation_id', conv.id);

        if (participants && participants.length >= 2) {
          // 5-8 Nachrichten pro Conversation
          const msgCount = 5 + Math.floor(Math.random() * 4);
          
          for (let i = 0; i < msgCount; i++) {
            const timestamp = new Date();
            timestamp.setHours(timestamp.getHours() - i);
            
            chatMessages.push({
              conversation_id: conv.id,
              sender_id: participants[i % participants.length].user_id,
              message_text: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
              message_type: 'text',
              created_at: timestamp.toISOString()
            });
          }
        }
      }

      const { error: chatError } = await supabase.from('chat_messages').insert(chatMessages);
      if (chatError) {
        console.error('Chat insert error:', chatError);
      } else {
        console.log(`Inserted ${chatMessages.length} chat messages`);
      }
    }

    // 3. Anrufe generieren
    const calls = [];
    const { data: profiles } = await supabase.from('profiles').select('user_id, company_id').limit(10);

    if (profiles && profiles.length >= 2) {
      for (let i = 0; i < 5; i++) {
        const caller = profiles[Math.floor(Math.random() * profiles.length)];
        const receiver = profiles[Math.floor(Math.random() * profiles.length)];
        
        if (caller.user_id !== receiver.user_id) {
          const timestamp = new Date();
          timestamp.setHours(timestamp.getHours() - i * 3);
          
          const duration = 30 + Math.floor(Math.random() * 600); // 30s - 10min
          
          calls.push({
            caller_id: caller.user_id,
            receiver_id: receiver.user_id,
            company_id: caller.company_id,
            call_type: Math.random() > 0.5 ? 'audio' : 'video',
            status: 'ended',
            duration_seconds: duration,
            started_at: timestamp.toISOString(),
            ended_at: new Date(timestamp.getTime() + duration * 1000).toISOString()
          });
        }
      }

      const { error: callsError } = await supabase.from('calls').insert(calls);
      if (callsError) {
        console.error('Calls insert error:', callsError);
      } else {
        console.log(`Inserted ${calls.length} calls`);
      }
    }

    // Logging
    await supabase.from('system_logs').insert({
      level: 'info',
      message: 'Test data generated',
      context: {
        gps_positions: gpsPositions.length,
        chat_messages: chatMessages.length,
        calls: calls.length,
        generated_by: user.email
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        generated: {
          gps_positions: gpsPositions.length,
          chat_messages: chatMessages.length,
          calls: calls.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Test data generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
