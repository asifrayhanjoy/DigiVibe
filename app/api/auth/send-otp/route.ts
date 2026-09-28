import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Otp from "@/lib/models/Otp";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, purpose, userData } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      await connectDB();
    } catch (dbErr: any) {
      console.error("❌ MongoDB Atlas connection failure during send OTP:", dbErr);
      return NextResponse.json(
        {
          success: false,
          message: `Database Connection Failed: ${dbErr?.message || "Check MONGODB_URI in Vercel environment variables."}`,
        },
        { status: 500 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      { otp, expiresAt, purpose: purpose || "login", userData },
      { upsert: true, new: true }
    );

    let emailSent = false;
    let emailMessage = "";

    const emailUser = (process.env.EMAIL_USER || process.env.SMTP_USER || "").trim();
    const emailPass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || "").replace(/\s+/g, "");

    if (emailUser && emailPass && !emailUser.includes("your_real_email")) {
      try {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || "gmail",
          auth: { user: emailUser, pass: emailPass },
        });

        await transporter.sendMail({
          from: `"DigiVibe Security" <${emailUser}>`,
          to: cleanEmail,
          subject: `🔐 Your DigiVibe Security OTP Code: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #080c14; color: #f1f5f9; padding: 40px; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #1e293b;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #06b6d4; margin: 0; font-size: 28px; font-weight: 900;">DigiVibe</h1>
                <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Enterprise Digital Services Marketplace</p>
              </div>
              <div style="background-color: #0f172a; padding: 24px; border-radius: 12px; text-align: center; border: 1px solid #06b6d4;">
                <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 12px;">Your 6-Digit Security OTP Code:</p>
                <div style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #06b6d4; background-color: #0284c715; padding: 12px; border-radius: 8px;">
                  ${otp}
                </div>
                <p style="color: #64748b; font-size: 11px; margin-top: 12px;">This OTP code expires in 5 minutes.</p>
              </div>
            </div>
          `,
        });
        emailSent = true;
        emailMessage = `Security OTP sent to ${cleanEmail}. Please check your email inbox.`;
      } catch (mailErr: any) {
        console.error("⚠️ Nodemailer Email Error:", mailErr?.message);
        emailMessage = `OTP generated (${otp}). Email sending error: ${mailErr?.message}`;
      }
    } else {
      console.log(`🔑 [OTP CREATED - DEMO MODE] OTP for ${cleanEmail} is ${otp}`);
      emailMessage = `Security OTP code sent to ${cleanEmail}. (Code: ${otp})`;
    }

    return NextResponse.json({
      success: true,
      message: emailMessage || `Security OTP sent to ${cleanEmail}`,
      email: cleanEmail,
      demoOtp: otp,
      expiresInSeconds: 300,
    });
  } catch (err: any) {
    console.error("❌ Send OTP API Server Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: `Send OTP Server Error: ${err?.message || "Internal server error."}`,
      },
      { status: 500 }
    );
  }
}
