import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// Resend API implementation without npm module
const RESEND_API_URL = 'https://api.resend.com/emails';
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

async function sendEmail(params: {
  from: string;
  to: string[];
  subject: string;
  html: string;
}) {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TemplateEmailRequest {
  template_id: string;
  recipient_email: string;
  booking_id?: string;
  customer_id?: string;
  custom_data?: Record<string, string>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { template_id, recipient_email, booking_id, customer_id, custom_data }: TemplateEmailRequest = await req.json();
    
    console.log('[SEND-TEMPLATE-EMAIL] Request received', { template_id, recipient_email });

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw userError;
    
    const user = userData.user;
    console.log('[SEND-TEMPLATE-EMAIL] User authenticated', { userId: user.id });

    // Get user's company
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) throw profileError;

    // Get company details
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', profile.company_id)
      .single();
    
    if (companyError) throw companyError;
    console.log('[SEND-TEMPLATE-EMAIL] Company found', { companyName: company.name });

    // Get email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', template_id)
      .eq('company_id', profile.company_id)
      .single();
    
    if (templateError) throw templateError;

    // Prepare replacement data
    let replacements: Record<string, string> = {
      company_name: company.name || 'MyDispatch',
      company_email: company.email || '',
      company_phone: company.phone || '',
      company_address: company.address || '',
      ...custom_data,
    };

    // If booking_id provided, fetch booking data
    if (booking_id) {
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*, customers(*)')
        .eq('id', booking_id)
        .eq('company_id', profile.company_id)
        .single();
      
      if (!bookingError && booking) {
        replacements = {
          ...replacements,
          customer_name: booking.customers ? `${booking.customers.first_name} ${booking.customers.last_name}` : '',
          pickup_address: booking.pickup_address || '',
          dropoff_address: booking.dropoff_address || '',
          pickup_time: booking.pickup_time || '',
          price: booking.price?.toString() || '0',
          booking_id: booking.id,
        };
      }
    }

    // If customer_id provided, fetch customer data
    if (customer_id) {
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customer_id)
        .eq('company_id', profile.company_id)
        .single();
      
      if (!customerError && customer) {
        replacements = {
          ...replacements,
          customer_name: `${customer.first_name} ${customer.last_name}`,
          customer_email: customer.email || '',
          customer_phone: customer.phone || '',
        };
      }
    }

    // Replace placeholders in subject and body
    let subject = template.subject || '';
    let body = template.body || '';

    Object.entries(replacements).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    });

    console.log('[SEND-TEMPLATE-EMAIL] Sending email', { to: recipient_email, subject });

    // Send email via Resend
    const resendDomain = Deno.env.get("RESEND_DOMAIN") || "onboarding@resend.dev";
    const fromEmail = resendDomain.includes('@') ? resendDomain : `noreply@${resendDomain}`;
    
    // Format body - preserve line breaks
    const formattedBody = body.replace(/\n/g, '<br>');
    
    const emailResponse = await sendEmail({
      from: `${company.name} <${fromEmail}>`,
      to: [recipient_email],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 60px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          
          <!-- Main Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td>
                
                <!-- Email Card -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.12);">
                  
                  <!-- Header with Brand -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #EADEBD 0%, #d6cbb0 100%); padding: 60px 45px; text-align: center;">
                      ${company.logo_url 
                        ? `<img src="${company.logo_url}" alt="${company.name}" style="max-height: 80px; max-width: 280px; margin: 0 auto; display: block; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));">` 
                        : `<h1 style="color: #323D5E; margin: 0; font-size: 36px; font-weight: 700; letter-spacing: -0.8px; text-shadow: 0 2px 4px rgba(0,0,0,0.05);">${company.name}</h1>`
                      }
                    </td>
                  </tr>
                  
                  <!-- Main Content Area -->
                  <tr>
                    <td style="padding: 55px 45px;">
                      <div style="color: #2d3748; font-size: 16px; line-height: 1.9; letter-spacing: 0.3px;">
                        ${formattedBody}
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Elegant Divider -->
                  <tr>
                    <td style="padding: 0 45px;">
                      <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, #e2e8f0 20%, #cbd5e1 50%, #e2e8f0 80%, transparent 100%); opacity: 0.6;"></div>
                    </td>
                  </tr>
                  
                  <!-- Contact Info Card -->
                  <tr>
                    <td style="padding: 45px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="padding: 30px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; border: 1px solid rgba(226, 232, 240, 0.5);">
                            <p style="margin: 0 0 20px 0; color: #323D5E; font-size: 13px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;">Kontakt & Support</p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                              ${company.phone ? `
                              <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                                  <span style="display: inline-block; width: 24px; font-size: 16px;">📞</span>
                                  <a href="tel:${company.phone}" style="color: #323D5E; text-decoration: none; font-weight: 500; transition: color 0.2s;">${company.phone}</a>
                                </td>
                              </tr>
                              ` : ''}
                              ${company.email ? `
                              <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                                  <span style="display: inline-block; width: 24px; font-size: 16px;">✉️</span>
                                  <a href="mailto:${company.email}" style="color: #323D5E; text-decoration: none; font-weight: 500; transition: color 0.2s;">${company.email}</a>
                                </td>
                              </tr>
                              ` : ''}
                              ${company.address ? `
                              <tr>
                                <td style="padding: 10px 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                                  <span style="display: inline-block; width: 24px; font-size: 16px;">📍</span>
                                  <span style="color: #475569;">${company.address}</span>
                                </td>
                              </tr>
                              ` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                </table>
                
                <!-- Footer -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 35px;">
                  <tr>
                    <td style="padding: 30px 20px; text-align: center;">
                      
                      <!-- Legal Links -->
                      <div style="margin-bottom: 22px;">
                        <a href="${Deno.env.get('SUPABASE_URL') || 'https://mydispatch.app'}/impressum" style="color: #64748b; text-decoration: none; font-size: 13px; margin: 0 15px; font-weight: 500; transition: color 0.2s;">Impressum</a>
                        <span style="color: #cbd5e1; margin: 0 5px;">•</span>
                        <a href="${Deno.env.get('SUPABASE_URL') || 'https://mydispatch.app'}/datenschutz" style="color: #64748b; text-decoration: none; font-size: 13px; margin: 0 15px; font-weight: 500; transition: color 0.2s;">Datenschutz</a>
                        <span style="color: #cbd5e1; margin: 0 5px;">•</span>
                        <a href="${Deno.env.get('SUPABASE_URL') || 'https://mydispatch.app'}/agb" style="color: #64748b; text-decoration: none; font-size: 13px; margin: 0 15px; font-weight: 500; transition: color 0.2s;">AGB</a>
                      </div>
                      
                      <!-- Company Info -->
                      <div style="color: #94a3b8; font-size: 13px; line-height: 1.7; margin-bottom: 18px;">
                        <strong style="color: #64748b; font-weight: 600;">${company.name}</strong>
                        ${company.tax_id ? `<br><span style="font-size: 12px;">USt-IdNr.: ${company.tax_id}</span>` : ''}
                      </div>
                      
                      <!-- Privacy Notice -->
                      <div style="color: #94a3b8; font-size: 11px; line-height: 1.7; max-width: 480px; margin: 0 auto 20px; padding: 15px; background: rgba(248, 250, 252, 0.5); border-radius: 8px;">
                        <strong style="color: #64748b; font-size: 12px; display: block; margin-bottom: 5px;">🔒 Datenschutz</strong>
                        Diese E-Mail wurde automatisch generiert. Ihre Daten werden gemäß DSGVO verarbeitet und nicht an Dritte weitergegeben.
                      </div>
                      
                      <!-- Copyright -->
                      <div style="color: #cbd5e1; font-size: 11px; margin-top: 15px; font-weight: 500;">
                        © ${new Date().getFullYear()} ${company.name} · Alle Rechte vorbehalten
                      </div>
                      
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `,
    });

    console.log('[SEND-TEMPLATE-EMAIL] Email sent successfully', emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('[SEND-TEMPLATE-EMAIL] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
