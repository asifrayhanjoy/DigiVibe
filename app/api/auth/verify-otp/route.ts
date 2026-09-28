import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Otp from "@/lib/models/Otp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = body;

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
          message: `Database Connection Failed: ${dbErr?.message || "Check MONGODB_URI in Vercel environment variables."}`,
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

    // Delete used OTP
    await Otp.deleteOne({ email: cleanEmail });

    // Retrieve or Create User
    let dbUser = await User.findOne({ email: cleanEmail });

    if (!dbUser) {
      const userData = otpRecord?.userData || {};
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
      console.log(`✅ [Next.js API - MongoDB Atlas] Authenticated User on OTP Verify: ${cleanEmail}`);
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
        phone: dbUser.phone,
        whatsapp: dbUser.whatsapp,
        address: dbUser.address,
        avatar: dbUser.avatar,
        walletBalance: dbUser.walletBalance,
        role: dbUser.role,
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
