import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseErr: any) {
      console.error("❌ Registration Request JSON Parsing Error:", parseErr);
      return NextResponse.json(
        { success: false, requiresOtp: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = body || {};

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        {
          success: false,
          requiresOtp: false,
          message: "Full Name, Email Address, Password, and Phone / WhatsApp Number are required.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    // 1. Connect to MongoDB Atlas
    try {
      await connectDB();
    } catch (dbErr: any) {
      console.error("❌ MongoDB Atlas connection failure during signup:", dbErr);
      return NextResponse.json(
        {
          success: false,
          requiresOtp: false,
          message: `Database Connection Failed: ${dbErr?.message || "Check MONGODB_URI in environment variables."}`,
        },
        { status: 500 }
      );
    }

    // 2. Check if User already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          requiresOtp: false,
          message: "An account with this email address already exists. Please log in directly.",
        },
        { status: 400 }
      );
    }

    // 3. Create User in MongoDB Atlas with isVerified: true
    let userDoc;
    try {
      userDoc = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: password,
        phone: cleanPhone,
        whatsapp: cleanPhone,
        address: "Dhaka, Bangladesh",
        walletBalance: 0,
        role: "customer",
        isVerified: true,
      });
      console.log(`✅ [Next.js API - MongoDB Atlas] Instant Direct Signup Success: ${cleanEmail}`);
    } catch (dbWriteErr: any) {
      console.error("❌ Registration Database Write Failure:", dbWriteErr);
      return NextResponse.json(
        {
          success: false,
          requiresOtp: false,
          message: `Database Save Error: ${dbWriteErr?.message || "Could not save user data to database."}`,
        },
        { status: 500 }
      );
    }

    // 4. Issue session token & set authentication cookies
    const token = "jwt_secure_token_digivibe_" + Date.now() + "_" + userDoc._id.toString();

    const response = NextResponse.json({
      success: true,
      requiresOtp: false,
      message: "Registration successful! Welcome to DigiVibe.",
      token,
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone || "",
        whatsapp: userDoc.whatsapp || "",
        address: userDoc.address || "Dhaka, Bangladesh",
        avatar: userDoc.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        walletBalance: userDoc.walletBalance || 0,
        role: userDoc.role || "customer",
        createdAt: userDoc.createdAt,
      },
    });

    response.cookies.set("token", token, { path: "/", maxAge: 604800, sameSite: "lax" });
    response.cookies.set("digivibe_token", token, { path: "/", maxAge: 604800, sameSite: "lax" });

    return response;
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


