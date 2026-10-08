import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email, reset code, and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 4 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      await connectDB();
    } catch (dbErr: any) {
      console.error("❌ MongoDB Atlas connection failure during reset password:", dbErr);
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
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    const now = new Date();
    let isOtpValid = false;

    if (
      userDoc.resetPasswordToken &&
      userDoc.resetPasswordToken === otp.trim() &&
      userDoc.resetPasswordExpires &&
      now < new Date(userDoc.resetPasswordExpires)
    ) {
      isOtpValid = true;
    }

    if (!isOtpValid) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired password reset code. Please request a new code." },
        { status: 400 }
      );
    }

    // Update User Password in MongoDB Atlas permanently
    userDoc.password = newPassword;
    userDoc.resetPasswordToken = undefined;
    userDoc.resetPasswordExpires = undefined;
    await userDoc.save();

    console.log(`✅ [MongoDB Atlas] Password updated successfully for: ${cleanEmail}`);

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (err: any) {
    console.error("❌ Reset Password API Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: `Reset Password Error: ${err?.message || "Internal server error."}`,
      },
      { status: 500 }
    );
  }
}

