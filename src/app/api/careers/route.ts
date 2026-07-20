import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Nodemailer uses the Node.js `net` module under the hood, and this route
// also reads the resume upload into a Buffer for the email attachment --
// both need the Node.js runtime, not Edge. Same requirement as WF Engine's
// /api/demo route, which this is modeled on.
export const runtime = 'nodejs';

// Careers applications go to hr@bitsbuffer.com. Hardcoded here rather
// than importing siteConfig.contact.email even though both now resolve
// to the same address (Adnan confirmed 2026-07-17: all mail lands at
// hr@bitsbuffer.com, teams@bitsbuffer.com is the confirmed sending
// account) -- the two inboxes are conceptually different jobs (HR/
// careers vs. general contact) that just happen to share one real
// mailbox today, and this route shouldn't silently start sending
// applications elsewhere if the general contact address ever changes
// again. Matches WF Engine's own /api/demo route, which also lands at
// hr@bitsbuffer.com.
const RECIPIENT = 'hr@bitsbuffer.com';

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const sanitize = (value: FormDataEntryValue | null, max = 500): string =>
  typeof value === 'string'
    ? value.replace(/<[^>]*>/g, '').replace(/[<>"'`]/g, '').trim().slice(0, max)
    : '';

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function buildEmailHtml(data: {
  name: string;
  email: string;
  phone: string;
  role: string;
  portfolio: string;
  message: string;
  resumeFilename: string;
  submittedAt: string;
}) {
  const rows: [string, string][] = [
    ['Full name', data.name],
    ['Email', data.email],
    ['Phone', data.phone || 'Not provided'],
    ['Role interested in', data.role],
    ['Portfolio / LinkedIn', data.portfolio || 'Not provided'],
    ['Resume attached', data.resumeFilename],
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
            <span style="color:rgba(255,255,255,0.65);font-size:13px;margin-left:8px;">Careers application</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px;color:#0F172A;font-size:16px;font-weight:700;">
              New application from <span style="color:#0F766E;">${data.name}</span>
            </p>

            ${rows.map(([label, value]) => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
              <tr>
                <td width="150" style="padding:10px 12px;background:#F8FAFC;border-radius:6px 0 0 6px;
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

            ${data.message ? `
            <div style="margin-top:20px;padding:16px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#5A6478;text-transform:uppercase;letter-spacing:0.08em;">
                Cover note
              </p>
              <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
            </div>` : ''}

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
              Submitted ${data.submittedAt} · Careers form at bitsbuffer.com/careers
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
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    const formData = await request.formData();

    // Honeypot, bots fill this in, real users never see it (hidden field,
    // same "hp_token" naming as ContactForm.tsx, see that file's header
    // comment on why "website" was the wrong name to use here).
    const hpToken = sanitize(formData.get('hp_token'), 100);
    if (hpToken) {
      return NextResponse.json({ ok: true }); // silent accept
    }

    const name = sanitize(formData.get('name'), 100);
    const email = sanitize(formData.get('email'), 254);
    const phone = sanitize(formData.get('phone'), 30);
    const role = sanitize(formData.get('role'), 80);
    const portfolio = sanitize(formData.get('portfolio'), 300);
    const message = sanitize(formData.get('message'), 2000);
    const resume = formData.get('resume');

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ error: 'Please attach your resume.' }, { status: 400 });
    }
    if (resume.size > MAX_RESUME_BYTES) {
      return NextResponse.json({ error: 'Resume file is too large. Max size is 5MB.' }, { status: 400 });
    }
    if (resume.type && !ALLOWED_RESUME_TYPES.includes(resume.type)) {
      return NextResponse.json({ error: 'Resume must be a PDF or Word document.' }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('[careers] SMTP env vars not configured');
      return NextResponse.json({ error: 'The application form is not configured yet.' }, { status: 503 });
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

    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const submittedAt = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Karachi',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    await transporter.sendMail({
      from: smtpUser,
      to: RECIPIENT,
      replyTo: email,
      subject: `New application: ${role} · ${name}`,
      html: buildEmailHtml({
        name,
        email,
        phone,
        role,
        portfolio,
        message,
        resumeFilename: resume.name,
        submittedAt,
      }),
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'n/a'}\nRole: ${role}\nPortfolio: ${portfolio || 'n/a'}\n\nCover note:\n${message || 'n/a'}`,
      attachments: [
        {
          filename: resume.name,
          content: resumeBuffer,
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Careers application submission failed', error);
    return NextResponse.json({ error: 'Unable to submit your application right now.' }, { status: 500 });
  }
}
