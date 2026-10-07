import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Otp from "@/lib/models/Otp";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseErr: any) {
      console.error("❌ OTP Verify Request JSON Parsing Error:", parseErr);
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { email, otp } = body || {};

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email address and OTP security code are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      await connectDB();
    } catch (dbErr: any) {
      console.error("❌ MongoDB Atlas connection failure during OTP verify:", dbErr);
      return NextResponse.json(
        {
          success: false,
          message: `Database Connection Failed: ${dbErr?.message || "Check MONGODB_URI in environment variables."}`,
        },
        { status: 500 }
      );
    }

    const otpRecord = await Otp.findOne({ email: cleanEmail });
    const isValid = otpRecord && otpRecord.otp === otp && new Date() < new Date(otpRecord.expiresAt);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP security code. Please try again or request a new code." },
        { status: 400 }
      );
    }

    // Retrieve or Create/Update User in MongoDB Atlas
    const userData = otpRecord?.userData || {};
    let dbUser;
    try {
      dbUser = await User.findOne({ email: cleanEmail });

      if (!dbUser) {
        dbUser = await User.create({
          name: userData.name || cleanEmail.split("@")[0],
          email: cleanEmail,
          password: userData.password || "hashed_default_pass_2026",
          phone: userData.phone || "",
          whatsapp: userData.phone || "",
          address: "Dhaka, Bangladesh",
          walletBalance: 0,
          role: "customer",
          isVerified: true,
        });
        console.log(`✅ [Next.js API - MongoDB Atlas] Saved NEW User on OTP Verify: ${cleanEmail}`);
      } else {
        if (userData.name) dbUser.name = userData.name;
        if (userData.password) dbUser.password = userData.password;
        if (userData.phone) {
          dbUser.phone = userData.phone;
          if (!dbUser.whatsapp) dbUser.whatsapp = userData.phone;
        }
        dbUser.isVerified = true;
        await dbUser.save();
        console.log(`✅ [Next.js API - MongoDB Atlas] Updated & Verified User in Database: ${cleanEmail}`);
      }
    } catch (userSaveErr: any) {
      console.error("❌ Error persisting user verification in Database:", userSaveErr);
      return NextResponse.json(
        {
          success: false,
          message: `Database Error: ${userSaveErr?.message || "Failed to verify and save user account."}`,
        },
        { status: 500 }
      );
    }

    // Delete used OTP ONLY after user is saved successfully
    try {
      await Otp.deleteOne({ email: cleanEmail });
    } catch (delOtpErr) {
      console.error("⚠️ Failed to delete used OTP:", delOtpErr);
    }

    const token = "jwt_secure_token_digivibe_" + Date.now();

    const response = NextResponse.json({
      success: true,
      message: "OTP verification successful!",
      token,
      user: {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || "",
        whatsapp: dbUser.whatsapp || "",
        address: dbUser.address || "Dhaka, Bangladesh",
        avatar: dbUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        walletBalance: dbUser.walletBalance || 0,
        role: dbUser.role || "customer",
        createdAt: dbUser.createdAt,
      },
    });

    response.cookies.set("token", token, { path: "/", maxAge: 604800, sameSite: "lax" });
    response.cookies.set("digivibe_token", token, { path: "/", maxAge: 604800, sameSite: "lax" });

    return response;
  } catch (err: any) {
    console.error("❌ OTP Verify API Server Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: `OTP Verification Error: ${err?.message || "Internal server error during verification."}`,
      },
      { status: 500 }
    );
  }
}

