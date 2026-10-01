const nodemailer = require('nodemailer');

const emailUser = (process.env.EMAIL_USER || process.env.SMTP_USER || process.env.MAIL_USER || '').trim();
const emailPass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.MAIL_PASS || '').replace(/\s+/g, '');
const emailService = process.env.EMAIL_SERVICE || 'gmail';

const isGmail = emailService === 'gmail' || !process.env.SMTP_HOST || (process.env.SMTP_HOST || '').includes('gmail');
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const isSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

const transporter = nodemailer.createTransport(
  isGmail
    ? {
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass },
        tls: { rejectUnauthorized: false }
      }
    : {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: smtpPort,
        secure: isSecure,
        auth: { user: emailUser, pass: emailPass },
        tls: { rejectUnauthorized: false }
      }
);

const sendOtpEmail = async (toEmail, otp, purpose = 'Verification') => {
  const recipientEmail = (toEmail || '').toLowerCase().trim();
  if (!recipientEmail || !recipientEmail.includes('@')) {
    console.error(`❌ [Mailer Error] Invalid target recipient email: "${toEmail}"`);
    return { success: false, error: 'Invalid target recipient email address.' };
  }

  const senderDomain = emailUser.includes('@') ? emailUser.split('@')[1] : 'digivibe.com';
  const messageIdDomain = senderDomain.includes('.') ? senderDomain : 'digivibe.com';

  const subject = `আপনার DigiVibe ভেরিফিকেশন কোড (OTP): ${otp}`;

  const plainText = `আপনার DigiVibe সিকিউরিটি ওটিপি কোড হলো: ${otp}। কোডটি ৫ মিনিটের জন্য কার্যকর।\n\n` +
    `Your DigiVibe security verification code is: ${otp}. Valid for 5 minutes.\n\n` +
    `নিরাপত্তার স্বার্থে এই কোডটি কারো সাথে শেয়ার করবেন না।\n` +
    `DigiVibe Platform - https://digivibe.com`;

  const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DigiVibe Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 460px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px 28px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);">
          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 24px; font-weight: 900; color: #0284c7; letter-spacing: -0.5px;">Digi<span style="color: #0369a1;">Vibe</span></span>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Security Verification</p>
            </td>
          </tr>
          
          <!-- Content Body -->
          <tr>
            <td style="padding: 24px 0 20px 0; text-align: center;">
              <p style="margin: 0 0 14px 0; font-size: 14px; color: #334155; font-weight: 600;">আপনার সিকিউরিটি ভেরিফিকেশন কোড (OTP):</p>
              
              <!-- Clean Centered OTP Code Box -->
              <div style="background-color: #f0f9ff; border: 1.5px solid #0284c7; border-radius: 12px; padding: 16px 24px; display: inline-block; margin: 0 auto;">
                <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #0284c7; display: block;">${otp}</span>
              </div>
              
              <p style="margin: 18px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.6;">
                কোডটি আগামী <strong>৫ মিনিটের</strong> জন্য কার্যকর থাকবে।<br>
                নিরাপত্তার স্বার্থে এই কোডটি কারো সাথে শেয়ার করবেন না।
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.5;">
              এই ইমেইলটি <strong>${recipientEmail}</strong> ঠিকানায় অটোমেটিকভাবে পাঠানো হয়েছে।<br>
              &copy; ${new Date().getFullYear()} DigiVibe Platform. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const uniqueMsgId = `<otp-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}@${messageIdDomain}>`;

  const mailOptions = {
    from: `"DigiVibe Support" <${emailUser || 'no-reply@digivibe.com'}>`,
    to: recipientEmail, // STRICTLY TARGET RECIPIENT EMAIL
    replyTo: emailUser || 'support@digivibe.com',
    subject: subject,
    text: plainText,
    html: htmlContent,
    headers: {
      'Message-ID': uniqueMsgId,
      'Auto-Submitted': 'auto-generated',
      'X-Auto-Response-Suppress': 'OOF, AutoReply, All',
      'X-Entity-Ref-ID': `otp-${Date.now()}`,
    },
  };

  try {
    if (!emailUser || emailUser.includes('your_real_email')) {
      console.error(`❌ [NODEMAILER ERROR] EMAIL_USER is missing or placeholder in environment variables.`);
      return { success: false, error: 'EMAIL_USER is not configured in environment variables' };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [SMTP HIGH-DELIVERABILITY SUCCESS] Real Email OTP sent to target recipient: ${recipientEmail}! MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [SMTP ERROR] Failed to send email to ${recipientEmail}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOtpEmail };
