import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Otp from "@/lib/models/Otp";
import { sendDeliverableOtpEmail } from "@/lib/emailService";

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

    const mailRes = await sendDeliverableOtpEmail({
      toEmail: cleanEmail,
      otp,
      purpose: purpose || "Verification"
    });

    if (mailRes.success) {
      emailSent = true;
      emailMessage = `Security OTP code sent to ${cleanEmail}. Please check your email inbox.`;
    } else if (mailRes.demo) {
      emailMessage = `Security OTP code sent to ${cleanEmail}. (Code: ${otp})`;
    } else {
      emailMessage = `OTP generated (${otp}). Email delivery notice: ${mailRes.error || "Check mailer configuration"}`;
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
