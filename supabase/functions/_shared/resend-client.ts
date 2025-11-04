// ==================================================================================
// RESEND CLIENT - Zentrale Resend-Integration
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Zentrale Resend-API Integration für alle E-Mail-Functions
// Autor: NeXify AI MASTER
// ==================================================================================

interface ResendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Uint8Array;
    content_type?: string;
  }>;
  tags?: Array<{ name: string; value: string }>;
}

interface ResendResponse {
  id: string;
  error?: {
    message: string;
    status: number;
  };
}

/**
 * Send Email via Resend API
 */
export async function sendResendEmail(options: ResendEmailOptions): Promise<ResendResponse> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const resendDomain = Deno.env.get("RESEND_DOMAIN") || "mydispatch.de";
  
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const from = options.from || `MyDispatch <noreply@${resendDomain}>`;
  const replyTo = options.replyTo || `support@${resendDomain}`;

  const payload = {
    from,
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
    text: options.text,
    reply_to: replyTo,
    ...(options.cc && { cc: Array.isArray(options.cc) ? options.cc : [options.cc] }),
    ...(options.bcc && { bcc: Array.isArray(options.bcc) ? options.bcc : [options.bcc] }),
    ...(options.attachments && { attachments: options.attachments }),
    ...(options.tags && { tags: options.tags }),
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Resend API error: ${response.status}`);
    }

    return {
      id: data.id,
    };
  } catch (error: any) {
    console.error("[RESEND] Send failed:", error);
    throw error;
  }
}

/**
 * Send Email with Retry Logic
 */
export async function sendResendEmailWithRetry(
  options: ResendEmailOptions,
  maxRetries: number = 3
): Promise<ResendResponse> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendResendEmail(options);
    } catch (error: any) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        console.warn(`[RESEND] Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
      }
    }
  }

  throw lastError || new Error("Failed to send email after retries");
}

