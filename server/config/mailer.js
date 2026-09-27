const nodemailer = require('nodemailer');

const emailUser = (process.env.EMAIL_USER || process.env.SMTP_USER || '').trim();
const emailPass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').replace(/\s+/g, '');
const emailService = process.env.EMAIL_SERVICE || 'gmail';

// Configure Gmail / SMTP Transporter
const transporter = nodemailer.createTransport(
  emailService === 'gmail'
    ? {
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      }
    : {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      }
);

/**
 * Send Real Email OTP to User
 */
const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"DigiVibe Security" <${emailUser || 'no-reply@digivibe.com'}>`,
    to: toEmail,
    subject: `🔐 Your DigiVibe Security OTP Code: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #080c14; color: #f1f5f9; padding: 40px; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #06b6d4; margin: 0; font-size: 28px; font-weight: 900;">DigiVibe</h1>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Enterprise Digital Services Marketplace</p>
        </div>

        <div style="background-color: #0f172a; padding: 24px; border-radius: 12px; text-align: center; border: 1px solid #06b6d4;">
          <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 12px;">Your 6-Digit Verification Security Code:</p>
          <div style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #06b6d4; background-color: #0284c715; padding: 12px; border-radius: 8px;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 11px; margin-top: 12px;">This OTP code expires in 5 minutes. Do not share it with anyone.</p>
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #64748b;">
          &copy; ${new Date().getFullYear()} DigiVibe Store. Automated Security System.
        </div>
      </div>
    `,
  };

  try {
    if (!emailUser || emailUser.includes('your_real_email')) {
      console.error(`❌ [NODEMAILER ERROR] EMAIL_USER is missing or placeholder in .env.`);
      return { success: false, error: 'EMAIL_USER is not configured in .env' };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [GMAIL SMTP SUCCESS] Real Email OTP sent to ${toEmail}! MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [GMAIL SMTP ERROR] Failed to send email to ${toEmail}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOtpEmail };

module.exports = { sendOtpEmail };
