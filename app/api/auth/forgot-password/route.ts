import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Otp from "@/lib/models/Otp";
import { sendDeliverableOtpEmail } from "@/lib/emailService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      await connectDB();
    } catch (dbErr: any) {
      console.error("❌ MongoDB Atlas connection failure during forgot password:", dbErr);
      return NextResponse.json(
        {
          success: false,
          message: `Database Connection Failed: ${dbErr?.message || "Check MONGODB_URI in environment variables."}`,
        },
        { status: 500 }
      );
    }

    const userDoc = await User.findOne({ email: cleanEmail });

    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: "No DigiVibe account found with this email address." },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP code for password reset
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Valid for 15 minutes

    // Save in Otp collection
    await Otp.findOneAndUpdate(
      { email: cleanEmail, purpose: "reset-password" },
      { otp: resetOtp, expiresAt, purpose: "reset-password" },
      { upsert: true, new: true }
    );

    // Save on User doc as well for double security
    userDoc.resetPasswordToken = resetOtp;
    userDoc.resetPasswordExpires = expiresAt;
    await userDoc.save();

    // Dispatch email
    const mailRes = await sendDeliverableOtpEmail({
      toEmail: cleanEmail,
      otp: resetOtp,
      purpose: "Password Reset"
    });

    let message = `Password reset code sent to ${cleanEmail}. Check your email inbox.`;
    if (mailRes.demo) {
      message = `Password reset code sent to ${cleanEmail}. (Code: ${resetOtp})`;
    } else if (!mailRes.success) {
      message = `Password reset OTP generated (${resetOtp}). Email delivery status: ${mailRes.error || "Check mailer setup"}`;
    }

    console.log(`✅ [Forgot Password API] Reset OTP generated for ${cleanEmail}: ${resetOtp}`);

    return NextResponse.json({
      success: true,
      message,
      email: cleanEmail,
      demoOtp: resetOtp,
    });
  } catch (err: any) {
    console.error("❌ Forgot Password API Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: `Forgot Password Error: ${err?.message || "Internal server error."}`,
      },
      { status: 500 }
    );
  }
}
