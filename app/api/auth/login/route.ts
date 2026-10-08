import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, requiresOtp: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Special hardcoded Master Admin Rule
    if (cleanEmail === "mdasifrayhanjoy2@gmail.com" && password === "@@@123@@@") {
      const adminUser = {
        id: "admin-master-001",
        name: "Md Asif Rayhan Joy (Admin)",
        email: "mdasifrayhanjoy2@gmail.com",
        phone: "01302271472",
        role: "admin",
        walletBalance: 99999,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        createdAt: new Date().toISOString(),
      };
      const adminToken = "admin_master_token_digivibe_2026";

      const res = NextResponse.json({
        success: true,
        requiresOtp: false,
        message: "Admin Authentication Granted! Welcome Md Asif Rayhan Joy.",
        user: adminUser,
        token: adminToken,
      });

      res.cookies.set("token", adminToken, { path: "/", maxAge: 604800, sameSite: "lax" });
      res.cookies.set("digivibe_token", adminToken, { path: "/", maxAge: 604800, sameSite: "lax" });
      return res;
    }

    // Connect to MongoDB Atlas
    try {
      await connectDB();
    } catch (dbErr: any) {
      console.error("❌ MongoDB Atlas connection failure during login:", dbErr);
      return NextResponse.json(
        {
          success: false,
          requiresOtp: false,
          message: `Database Connection Failed: ${dbErr?.message || "Check MONGODB_URI in environment variables."}`,
        },
        { status: 500 }
      );
    }

    const userDoc = await User.findOne({ email: cleanEmail });
    if (!userDoc || userDoc.password !== password) {
      return NextResponse.json(
        {
          success: false,
          requiresOtp: false,
          message: "Invalid email address or password.",
        },
        { status: 401 }
      );
    }

    const token = "jwt_secure_token_digivibe_" + Date.now() + "_" + userDoc._id.toString();

    const response = NextResponse.json({
      success: true,
      requiresOtp: false,
      message: "Login successful! Welcome back to DigiVibe.",
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
    console.error("❌ Login API Server Error:", err);
    return NextResponse.json(
      {
        success: false,
        requiresOtp: false,
        message: `Login Server Error: ${err?.message || "Internal server error during login."}`,
      },
      { status: 500 }
    );
  }
}

