import nodemailer from "nodemailer";

interface SendOtpOptions {
  toEmail: string;
  otp: string;
  purpose?: string;
}

/**
 * ----------------------------------------------------------------------------------
 * DEVELOPER GUIDE: 100% INBOX EMAIL DELIVERABILITY (SPF / DKIM / DMARC CHECKLIST)
 * ----------------------------------------------------------------------------------
 * To ensure 100% Inbox delivery on Gmail, Outlook & Yahoo for custom domains:
 *
 * 1. SPF Record (TXT Record on DNS Provider):
 *    Host: @  Value: v=spf1 include:_spf.google.com ~all (or your SMTP provider SPF)
 *
 * 2. DKIM Record (TXT Record on DNS Provider):
 *    Generate DKIM key in Google Admin Console / cPanel / SendGrid and add:
 *    Host: google._domainkey  Value: v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8...
 *
 * 3. DMARC Record (TXT Record on DNS Provider):
 *    Host: _dmarc  Value: v=DMARC1; p=none; sp=none; rua=mailto:dmarc-reports@digivibe.com
 *
 * 4. Gmail App Password / OAuth2:
 *    Use standard 16-character Gmail App Passwords without spaces from Google Account > Security.
 * ----------------------------------------------------------------------------------
 */

export async function sendDeliverableOtpEmail({ toEmail, otp, purpose = "Verification" }: SendOtpOptions) {
  const emailUser = (process.env.EMAIL_USER || process.env.SMTP_USER || "").trim();
  const emailPass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || "").replace(/\s+/g, "");

  if (!emailUser || !emailPass || emailUser.includes("your_real_email")) {
    console.log(`ℹ️ [Mailer Demo Mode] EMAIL_USER not configured. OTP for ${toEmail} is ${otp}`);
    return { success: false, demo: true, message: "EMAIL_USER not configured in environment." };
  }

  const cleanToEmail = toEmail.toLowerCase().trim();
  const senderDomain = emailUser.includes("@") ? emailUser.split("@")[1] : "digivibe.com";

  // 1. Create Nodemailer Transporter
  const transporter = nodemailer.createTransport(
    process.env.EMAIL_SERVICE === "gmail" || !process.env.SMTP_HOST
      ? {
          service: "gmail",
          auth: { user: emailUser, pass: emailPass },
        }
      : {
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "587", 10),
          secure: process.env.SMTP_SECURE === "true",
          auth: { user: emailUser, pass: emailPass },
        }
  );

  // 2. High-Trust Transactional Subject Line (Strictly avoids spam trigger terms like "URGENT" or "FREE")
  const subject = `DigiVibe verification code: ${otp}`;

  // 3. Clean Plain-Text Alternative Payload (MANDATORY for Gmail/Yahoo Spam Filter Trust Score)
  const textContent = `Your DigiVibe verification code is: ${otp}\n\n` +
    `Enter this code to complete your ${purpose.toLowerCase()} process. This single-use code is valid for 5 minutes.\n\n` +
    `For your security, never share this code with anyone.\n\n` +
    `---\n` +
    `DigiVibe Security Services\n` +
    `https://digivibe.com`;

  // 4. Professional Clean Transactional HTML Layout
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DigiVibe Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);">
          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 26px; font-weight: 900; color: #0284c7; letter-spacing: -0.5px;">Digi<span style="color: #0284c7;">Vibe</span></span>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Digital Services Platform</p>
            </td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 0 24px 0; text-align: center;">
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155; font-weight: 600;">Your Security Verification Code</p>
              
              <!-- OTP Box -->
              <div style="background-color: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 12px; padding: 18px 24px; margin: 0 auto; display: inline-block;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0284c7; display: block;">${otp}</span>
              </div>
              
              <p style="margin: 20px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.6;">
                This single-use code is valid for <strong>5 minutes</strong>.<br>
                Please do not share this code with anyone for account security.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5;">
              This is an automated transactional security message from DigiVibe.<br>
              &copy; ${new Date().getFullYear()} DigiVibe Platform. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const uniqueMsgId = `<otp-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}@${senderDomain}>`;

  // 5. Build Spam-Filter Bypass Headers (First-Class Transactional Mailer Package)
  const mailOptions = {
    from: `"DigiVibe Security" <${emailUser}>`,
    to: cleanToEmail,
    replyTo: `"DigiVibe Support" <${emailUser}>`,
    subject: subject,
    text: textContent,
    html: htmlContent,
    headers: {
      "Message-ID": uniqueMsgId,
      "X-Priority": "1",
      "Priority": "urgent",
      "Importance": "high",
      "X-Mailer": "DigiVibe Security Mailer v2.5",
      "Auto-Submitted": "auto-generated",
      "X-Auto-Response-Suppress": "OOF, AutoReply",
      "Precedence": "first-class",
      "Feedback-ID": "otp:digivibe:security:1",
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [High-Deliverability SMTP] OTP Email sent successfully to ${cleanToEmail}. MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`❌ [SMTP Dispatch Error] Failed to deliver OTP email to ${cleanToEmail}:`, err?.message);
    return { success: false, error: err?.message };
  }
}
