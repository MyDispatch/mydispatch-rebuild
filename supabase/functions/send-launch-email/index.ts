import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[Launch Email] Starting launch communication...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    // Get all active companies with admin users
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select(`
        id,
        name,
        email,
        company_status,
        profiles!inner (
          user_id,
          first_name,
          last_name
        )
      `)
      .eq('company_status', 'active')
      .not('email', 'is', null);

    if (companiesError) {
      throw new Error(`Failed to fetch companies: ${companiesError.message}`);
    }

    console.log(`[Launch Email] Found ${companies?.length || 0} active companies`);

    const emailsSent: string[] = [];
    const emailsFailed: string[] = [];

    // Send launch email to each company
    for (const company of companies || []) {
      try {
        const adminName = company.profiles?.[0]?.first_name 
          ? `${company.profiles[0].first_name} ${company.profiles[0].last_name || ''}`.trim()
          : 'Administrator';

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #EADEBD 0%, #A28A5B 100%); padding: 40px 20px; text-align: center; }
              .header h1 { color: #323D5E; margin: 0; font-size: 28px; font-weight: 700; }
              .header p { color: #323D5E; margin: 10px 0 0 0; font-size: 16px; }
              .content { padding: 40px 30px; color: #323D5E; line-height: 1.6; }
              .content h2 { color: #323D5E; font-size: 22px; margin-top: 0; }
              .features { background: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0; }
              .feature-item { margin: 15px 0; display: flex; align-items: start; }
              .feature-icon { color: #22c55e; margin-right: 10px; font-size: 20px; }
              .feature-text { flex: 1; }
              .feature-title { font-weight: 600; color: #323D5E; margin-bottom: 5px; }
              .cta-button { display: inline-block; background: #EADEBD; color: #323D5E; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; transition: all 0.3s; }
              .cta-button:hover { background: #A28A5B; color: white; }
              .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6c757d; font-size: 14px; }
              .footer a { color: #A28A5B; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚀 MyDispatch ist jetzt live!</h1>
                <p>Ihre intelligente Dispositions-Software ist bereit</p>
              </div>
              
              <div class="content">
                <h2>Hallo ${adminName},</h2>
                
                <p>wir freuen uns, Ihnen mitteilen zu können, dass <strong>MyDispatch V18.3.24</strong> erfolgreich live gegangen ist! 🎉</p>
                
                <p>Ihr Unternehmen <strong>${company.name}</strong> kann ab sofort alle Premium-Funktionen nutzen:</p>
                
                <div class="features">
                  <div class="feature-item">
                    <div class="feature-icon">✅</div>
                    <div class="feature-text">
                      <div class="feature-title">KI-gestützte Fahrer-Zuweisung</div>
                      Automatische, intelligente Routenplanung mit Gemini AI
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <div class="feature-icon">✅</div>
                    <div class="feature-text">
                      <div class="feature-title">Echtzeit GPS-Tracking</div>
                      Live-Verfolgung aller Fahrzeuge mit HERE Maps Integration
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <div class="feature-icon">✅</div>
                    <div class="feature-text">
                      <div class="feature-title">Mobile PWA-App</div>
                      Vollständig responsiv und offline-fähig für Fahrer
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <div class="feature-icon">✅</div>
                    <div class="feature-text">
                      <div class="feature-title">Automatisierte Workflows</div>
                      25+ n8n-Workflows für E-Mails, Benachrichtigungen und Berichte
                    </div>
                  </div>
                  
                  <div class="feature-item">
                    <div class="feature-icon">✅</div>
                    <div class="feature-text">
                      <div class="feature-title">DSGVO-Konform</div>
                      Automatische GPS-Löschung nach 24h, Sentry-Anonymisierung
                    </div>
                  </div>
                </div>
                
                <p><strong>Was Sie jetzt tun können:</strong></p>
                <ul>
                  <li>Erkunden Sie die neuen Dashboard-Widgets mit Live-Daten</li>
                  <li>Testen Sie die KI-gestützte Smart Assignment</li>
                  <li>Laden Sie Ihr Team zum Unternehmens-Chat ein</li>
                  <li>Konfigurieren Sie Ihre gebrandete Landingpage</li>
                </ul>
                
                <center>
                  <a href="https://my-dispatch.de/dashboard" class="cta-button">
                    Zum Dashboard
                  </a>
                </center>
                
                <p>Bei Fragen oder Unterstützung stehen wir Ihnen gerne zur Verfügung. Nutzen Sie dazu den KI-Support-Chat in Ihrer Dashboard-Ansicht.</p>
                
                <p>Viel Erfolg mit MyDispatch!</p>
                
                <p>
                  <strong>Ihr MyDispatch-Team</strong><br>
                  RideHub Solutions GmbH
                </p>
              </div>
              
              <div class="footer">
                <p>
                  <a href="https://my-dispatch.de">my-dispatch.de</a> | 
                  <a href="https://my-dispatch.de/datenschutz">Datenschutz</a> | 
                  <a href="https://my-dispatch.de/impressum">Impressum</a>
                </p>
                <p>RideHub Solutions GmbH | Ensbachmühle 4 | 94571 Schaufling | Deutschland</p>
                <p style="margin-top: 20px; color: #9ca3af; font-size: 12px;">
                  Sie erhalten diese E-Mail, weil Sie ein aktives MyDispatch-Konto haben.<br>
                  Zum Abbestellen wenden Sie sich bitte an: <a href="mailto:info@my-dispatch.de" style="color: #9ca3af;">info@my-dispatch.de</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `;

        const emailResponse = await resend.emails.send({
          from: 'MyDispatch <info@my-dispatch.de>',
          to: [company.email],
          subject: '🚀 MyDispatch ist jetzt live - Alle Features verfügbar!',
          html: emailHtml,
        });

        console.log(`[Launch Email] Sent to ${company.email}:`, emailResponse);
        emailsSent.push(company.email);
      } catch (error) {
        console.error(`[Launch Email] Failed to send to ${company.email}:`, error);
        emailsFailed.push(company.email);
      }
    }

    // Log to brain_logs
    await supabase.from('brain_logs').insert({
      agent_action: 'send_launch_emails',
      input_context: {
        total_companies: companies?.length || 0,
        timestamp: new Date().toISOString()
      },
      output_result: {
        emails_sent: emailsSent.length,
        emails_failed: emailsFailed.length,
        success_rate: `${((emailsSent.length / (companies?.length || 1)) * 100).toFixed(1)}%`,
        failed_addresses: emailsFailed
      },
      success: emailsFailed.length === 0,
      confidence: emailsFailed.length === 0 ? 1.0 : 0.7
    });

    return new Response(
      JSON.stringify({
        success: true,
        emails_sent: emailsSent.length,
        emails_failed: emailsFailed.length,
        success_rate: `${((emailsSent.length / (companies?.length || 1)) * 100).toFixed(1)}%`,
        details: {
          sent_to: emailsSent,
          failed: emailsFailed
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('[Launch Email] Critical error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
