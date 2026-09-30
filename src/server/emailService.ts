import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export interface LeadEmailPayload {
  id: string;
  name: string;
  phone: string;
  email: string;
  fitness_goal: string;
  preferred_workout_time: string;
  message?: string;
  created_at: string;
}

export interface EmailDispatchLog {
  id: string;
  timestamp: string;
  leadId: string;
  leadName: string;
  recipient: string;
  provider: 'resend' | 'smtp' | 'console_simulated';
  status: 'delivered' | 'failed' | 'simulated';
  subject: string;
  error?: string;
}

// In-memory dispatch logs for admin inspection
const dispatchLogs: EmailDispatchLog[] = [];

export function getEmailDispatchLogs(): EmailDispatchLog[] {
  return [...dispatchLogs].slice(-50);
}

export function getEmailConfigurationStatus() {
  const resendKey = process.env.RESEND_API_KEY || '';
  const smtpHost = process.env.SMTP_HOST || '';
  const smtpUser = process.env.SMTP_USER || '';
  const recipient = process.env.OWNER_NOTIFICATION_EMAIL || 'owner@ironfitfitness.example';
  const fromEmail = process.env.EMAIL_FROM || 'IronFit Studio <onboarding@resend.dev>';

  let activeProvider: 'resend' | 'smtp' | 'none' = 'none';
  if (resendKey.trim().length > 10) {
    activeProvider = 'resend';
  } else if (smtpHost.trim().length > 3 && smtpUser.trim().length > 2) {
    activeProvider = 'smtp';
  }

  return {
    isConfigured: activeProvider !== 'none',
    activeProvider,
    recipient,
    fromEmail,
    hasResendKey: Boolean(resendKey.trim().length > 10),
    hasSmtpConfig: Boolean(smtpHost.trim().length > 3 && smtpUser.trim().length > 2),
    smtpHost: smtpHost ? `${smtpHost}:${process.env.SMTP_PORT || 587}` : null,
    totalDispatched: dispatchLogs.filter((l) => l.status === 'delivered').length,
    recentLogs: getEmailDispatchLogs(),
  };
}

/**
 * Builds high-converting, professional HTML email template
 */
function buildLeadEmailHtml(lead: LeadEmailPayload): string {
  const phoneClean = lead.phone.replace(/[^0-9+]/g, '');
  const waPhone = lead.phone.replace(/[^0-9]/g, '');
  const submissionTime = new Date(lead.created_at).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead: ${lead.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f5f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0c0a09; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" max-width="600" style="max-width: 600px; background-color: #1c1917; border: 1px solid #292524; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%); padding: 24px 30px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #fecaca; display: block; margin-bottom: 4px;">
                      IRONFIT FITNESS STUDIO
                    </span>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">
                      ⚡ New Lead: 30-Day Fitness Challenge
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro Banner -->
          <tr>
            <td style="padding: 20px 30px; background-color: #171412; border-bottom: 1px solid #292524;">
              <p style="margin: 0; font-size: 14px; color: #d6d3d1; line-height: 1.5;">
                A new prospect has submitted their details for the <strong>30-Day Fitness Challenge</strong> via the website form.
              </p>
            </td>
          </tr>

          <!-- Prospect Information Table -->
          <tr>
            <td style="padding: 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0a09; border: 1px solid #292524; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1c1917; width: 35%; color: #a8a29e; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                    Prospect Name
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1c1917; color: #ffffff; font-size: 16px; font-weight: 700;">
                    ${lead.name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1c1917; color: #a8a29e; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                    Phone Number
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1c1917; color: #ef4444; font-size: 16px; font-weight: 700;">
                    <a href="tel:${phoneClean}" style="color: #ef4444; text-decoration: none;">${lead.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1c1917; color: #a8a29e; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                    Email Address
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1c1917; color: #38bdf8; font-size: 14px;">
                    <a href="mailto:${lead.email}" style="color: #38bdf8; text-decoration: none;">${lead.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1c1917; color: #a8a29e; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                    Fitness Goal
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1c1917;">
                    <span style="display: inline-block; background-color: #450a0a; color: #f87171; border: 1px solid #991b1b; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700;">
                      ${lead.fitness_goal}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1c1917; color: #a8a29e; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                    Preferred Time
                  </td>
                  <td style="padding: 14px 18px; border-bottom: 1px solid #1c1917; color: #fbbf24; font-size: 14px; font-weight: 600;">
                    ⏰ ${lead.preferred_workout_time}
                  </td>
                </tr>
                ${
                  lead.message
                    ? `
                <tr>
                  <td style="padding: 14px 18px; color: #a8a29e; font-size: 12px; font-weight: 700; text-transform: uppercase; vertical-align: top;">
                    Message
                  </td>
                  <td style="padding: 14px 18px; color: #e7e5e4; font-size: 14px; line-height: 1.5; font-style: italic;">
                    "${lead.message}"
                  </td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding: 14px 18px; color: #78716c; font-size: 11px; text-transform: uppercase;">
                    Received At
                  </td>
                  <td style="padding: 14px 18px; color: #78716c; font-size: 12px;">
                    ${submissionTime} IST (Lead ID: ${lead.id})
                  </td>
                </tr>
              </table>

              <!-- Quick Action CTA Buttons -->
              <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a8a29e;">
                Quick Response Actions:
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="padding-bottom: 12px;">
                    <a href="tel:${phoneClean}" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 700; margin-right: 8px; margin-bottom: 8px;">
                      📞 Call ${lead.name.split(' ')[0]}
                    </a>
                    <a href="https://wa.me/${waPhone}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20registering%20for%20the%20IronFit%2030-Day%20Fitness%20Challenge!%20When%20is%20a%20good%20time%20for%20your%20fitness%20assessment?" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 700; margin-right: 8px; margin-bottom: 8px;">
                      💬 WhatsApp
                    </a>
                    <a href="mailto:${lead.email}?subject=IronFit%2030-Day%20Fitness%20Challenge%20Assessment" style="display: inline-block; background-color: #292524; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; border: 1px solid #44403c; margin-bottom: 8px;">
                      ✉️ Reply Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #141210; border-top: 1px solid #292524; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #78716c; line-height: 1.5;">
                This automatic notification was sent by <strong>IronFit Fitness Studio</strong> lead intake engine.<br>
                Saved to Supabase database table: <code>public.leads</code>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Builds plain text fallback
 */
function buildLeadEmailText(lead: LeadEmailPayload): string {
  return `
==============================================================
IRONFIT FITNESS STUDIO — NEW LEAD NOTIFICATION
Campaign: 30-Day Fitness Challenge
==============================================================

Prospect Details:
- Name: ${lead.name}
- Phone: ${lead.phone}
- Email: ${lead.email}
- Fitness Goal: ${lead.fitness_goal}
- Preferred Workout Time: ${lead.preferred_workout_time}
- Message: ${lead.message || 'None provided'}

Lead ID: ${lead.id}
Timestamp: ${lead.created_at}

Action Steps:
1. Call Prospect: tel:${lead.phone.replace(/[^0-9+]/g, '')}
2. WhatsApp: https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}
3. Open Admin Portal: /admin

Saved securely to Supabase leads table.
==============================================================
  `.trim();
}

/**
 * Dispatches the lead email to the gym owner via Resend or SMTP
 */
export async function sendLeadNotificationEmail(
  lead: LeadEmailPayload,
  targetRecipient?: string
): Promise<{ success: boolean; provider: string; messageId?: string; error?: string }> {
  const recipient =
    targetRecipient || process.env.OWNER_NOTIFICATION_EMAIL || 'owner@ironfitfitness.example';
  const resendApiKey = process.env.RESEND_API_KEY || '';
  const smtpHost = process.env.SMTP_HOST || '';
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const fromEmail = process.env.EMAIL_FROM || 'IronFit Studio <onboarding@resend.dev>';

  const subject = `🔥 New Lead Alert: ${lead.name} (${lead.fitness_goal}) - IronFit 30-Day Challenge`;
  const html = buildLeadEmailHtml(lead);
  const text = buildLeadEmailText(lead);

  // 1. Try Resend Provider
  if (resendApiKey.trim().length > 10) {
    try {
      const resend = new Resend(resendApiKey.trim());
      const response = await resend.emails.send({
        from: fromEmail,
        to: recipient,
        subject,
        html,
        text,
      });

      if (!response.error && response.data?.id) {
        console.log(`[Email Dispatched via Resend]: ID ${response.data.id} to ${recipient}`);
        const log: EmailDispatchLog = {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          leadId: lead.id,
          leadName: lead.name,
          recipient,
          provider: 'resend',
          status: 'delivered',
          subject,
        };
        dispatchLogs.push(log);
        return { success: true, provider: 'resend', messageId: response.data.id };
      } else {
        console.warn('[Resend notice - attempting SMTP fallback]:', response.error?.message);
        dispatchLogs.push({
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          leadId: lead.id,
          leadName: lead.name,
          recipient,
          provider: 'resend',
          status: 'failed',
          subject,
          error: response.error?.message || 'Resend error',
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown Resend error';
      console.warn('[Resend exception - attempting SMTP fallback]:', errorMsg);
      dispatchLogs.push({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        leadId: lead.id,
        leadName: lead.name,
        recipient,
        provider: 'resend',
        status: 'failed',
        subject,
        error: errorMsg,
      });
    }
  }

  // 2. Try SMTP Provider (Gmail, Brevo, SendGrid, Amazon SES)
  if (smtpHost.trim().length > 3 && smtpUser.trim().length > 2) {
    try {
      const cleanPass = smtpPass.replace(/\s+/g, '').trim();
      const transporter = nodemailer.createTransport({
        host: smtpHost.trim(),
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser.trim(),
          pass: cleanPass,
        },
      });

      const info = await transporter.sendMail({
        from: fromEmail.includes('@') && !fromEmail.includes('resend.dev') ? fromEmail : `IronFit Fitness Studio <${smtpUser.trim()}>`,
        to: recipient,
        subject,
        html,
        text,
      });

      console.log(`[Email Dispatched via SMTP]: MessageId ${info.messageId} to ${recipient}`);
      dispatchLogs.push({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        leadId: lead.id,
        leadName: lead.name,
        recipient,
        provider: 'smtp',
        status: 'delivered',
        subject,
      });
      return { success: true, provider: 'smtp', messageId: info.messageId };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown SMTP error';
      console.error('[SMTP Exception]:', errorMsg);
      dispatchLogs.push({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        leadId: lead.id,
        leadName: lead.name,
        recipient,
        provider: 'smtp',
        status: 'failed',
        subject,
        error: errorMsg,
      });
      return { success: false, provider: 'smtp', error: errorMsg };
    }
  }

  // 3. Simulated / Log Mode (Pending credentials)
  console.log(`
==============================================================
[LEAD NOTIFICATION EMAIL DISPATCH] (Simulated / Pending Config)
Recipient: ${recipient}
Subject: ${subject}
Lead Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email}
Goal: ${lead.fitness_goal}
Workout Time: ${lead.preferred_workout_time}
Message: ${lead.message || '(None)'}

Notice: To have emails actually delivered to your inbox, set
RESEND_API_KEY (or SMTP credentials) in your .env or Admin Portal.
==============================================================
  `);

  dispatchLogs.push({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    leadId: lead.id,
    leadName: lead.name,
    recipient,
    provider: 'console_simulated',
    status: 'simulated',
    subject,
    error: 'No email service credentials configured yet (RESEND_API_KEY or SMTP)',
  });

  return {
    success: true,
    provider: 'console_simulated',
    messageId: `sim_${Date.now()}`,
  };
}
