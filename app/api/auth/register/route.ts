import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Otp from "@/lib/models/Otp";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, requiresOtp: false, message: "Email and password are required for registration." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Connect to MongoDB Atlas
    try {
      await connectDB();
    } catch (dbErr: any) {
      console.error("❌ MongoDB Atlas connection failure during signup:", dbErr);
      return NextResponse.json(
        {
          success: false,
          requiresOtp: false,
          message: `Database Connection Failed: ${dbErr?.message || "Check MONGODB_URI in Vercel environment variables."}`,
        },
        { status: 500 }
      );
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const userData = {
      name: name || cleanEmail.split("@")[0],
      email: cleanEmail,
      password: password,
      phone: phone || "",
    };

    // 3. Find or Create User document in MongoDB Atlas
    let userDoc = await User.findOne({ email: cleanEmail });
    if (!userDoc) {
      userDoc = await User.create(userData);
      console.log(`✅ [Next.js API - MongoDB Atlas] Registered NEW User: ${cleanEmail}`);
    } else {
      console.log(`ℹ️ [Next.js API - MongoDB Atlas] User already exists: ${cleanEmail}`);
    }

    // 4. Save/Update OTP in MongoDB Atlas
    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      { otp, expiresAt, purpose: "signup", userData },
      { upsert: true, new: true }
    );

    // 5. Send Real Email OTP using Nodemailer if configured
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
                <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 12px;">Your 6-Digit Verification Security Code:</p>
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
        emailMessage = `OTP generated (${otp}). Email sending failed: ${mailErr?.message}`;
      }
    } else {
      console.log(`🔑 [OTP CREATED - DEV/PROD DEMO MODE] OTP for ${cleanEmail} is ${otp}`);
      emailMessage = `Security OTP code sent to ${cleanEmail}. (Code: ${otp})`;
    }

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      message: emailMessage || `Security OTP sent to ${cleanEmail}`,
      email: cleanEmail,
      demoOtp: otp,
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone,
      },
    });
  } catch (err: any) {
    console.error("❌ Registration API Server Error:", err);
    return NextResponse.json(
      {
        success: false,
        requiresOtp: false,
        message: `Signup Server Error: ${err?.message || "Internal server error during registration."}`,
      },
      { status: 500 }
    );
  }
}
