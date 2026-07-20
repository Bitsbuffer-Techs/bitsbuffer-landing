import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { siteConfig } from '@/lib/site-config';

// Brought up to the same standard as /api/careers 2026-07-17, Adnan's
// call ("implement same on contact us form as well"): sanitize + validate
// every field server-side (this route trusted raw client strings before),
// silent-accept on the honeypot instead of a visible 400 (a 400 on
// honeypot trip tells a bot its field was detected, silent accept
// doesn't), and a branded HTML email instead of plain text only, same
// template shape as the careers route, different subtitle/fields/
// recipient. Explicit Node.js runtime added for the same reason the
// careers route needs it, nodemailer uses the `net` module, not
// available on Edge.
export const runtime = 'nodejs';

const sanitize = (value: unknown, max = 500): string =>
  typeof value === 'string'
    ? value.replace(/<[^>]*>/g, '').replace(/[<>"'`]/g, '').trim().slice(0, max)
    : '';

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function buildEmailHtml(data: { name: string; email: string; company: string; message: string; submittedAt: string }) {
  const rows: [string, string][] = [
    ['Full name', data.name],
    ['Email', data.email],
    ['Company', data.company || 'Not provided'],
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #E2E8F0;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0F766E;padding:24px 32px;">
            <span style="color:#ffffff;font-size:20px;font-weight:900;letter-spacing:-0.5px;">Bitsbuffer</span>
            <span style="color:rgba(255,255,255,0.65);font-size:13px;margin-left:8px;">Contact inquiry</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px;color:#0F172A;font-size:16px;font-weight:700;">
              New inquiry from <span style="color:#0F766E;">${data.name}</span>
            </p>

            ${rows.map(([label, value]) => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
              <tr>
                <td width="120" style="padding:10px 12px;background:#F8FAFC;border-radius:6px 0 0 6px;
                    font-size:11px;font-weight:700;color:#5A6478;text-transform:uppercase;letter-spacing:0.08em;
                    border:1px solid #E2E8F0;border-right:none;white-space:nowrap;">
                  ${label}
                </td>
                <td style="padding:10px 14px;background:#FFFFFF;border-radius:0 6px 6px 0;
                    font-size:13px;color:#0F172A;border:1px solid #E2E8F0;">
                  ${value}
                </td>
              </tr>
            </table>`).join('')}

            <div style="margin-top:20px;padding:16px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#5A6478;text-transform:uppercase;letter-spacing:0.08em;">
                Message
              </p>
              <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
            </div>

            <div style="margin-top:28px;padding-top:20px;border-top:1px solid #E2E8F0;">
              <a href="mailto:${data.email}"
                style="display:inline-block;background:#0F766E;color:#ffffff;text-decoration:none;
                       padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;">
                Reply to ${data.name} →
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;">
            <p style="margin:0;font-size:11px;color:#94A3B8;">
              Submitted ${data.submittedAt} · Contact form at bitsbuffer.com/contact
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    // Matches ContactForm.tsx's honeypot field, renamed from "website" to
    // "hp_token" 2026-07-08, see that file's header comment for why.
    const hpToken = sanitize((body as Record<string, unknown>).hp_token, 100);
    if (hpToken) {
      return NextResponse.json({ ok: true }); // silent accept, don't tip off the bot
    }

    const name = sanitize((body as Record<string, unknown>).name, 100);
    const email = sanitize((body as Record<string, unknown>).email, 254);
    const company = sanitize((body as Record<string, unknown>).company, 100);
    const message = sanitize((body as Record<string, unknown>).message, 2000);

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('[contact] SMTP env vars not configured');
      return NextResponse.json({ error: 'The contact form is not configured yet.' }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const submittedAt = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Karachi',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    await transporter.sendMail({
      from: smtpUser,
      to: siteConfig.contact.email,
      replyTo: email,
      subject: `New Bitsbuffer inquiry from ${name}`,
      html: buildEmailHtml({ name, email, company, message, submittedAt }),
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'n/a'}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form submission failed', error);
    return NextResponse.json({ error: 'Unable to send your message right now.' }, { status: 500 });
  }
}
