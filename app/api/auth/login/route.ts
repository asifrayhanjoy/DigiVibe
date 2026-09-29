import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Otp from "@/lib/models/Otp";
import { sendDeliverableOtpEmail } from "@/lib/emailService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

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
          message: `Database Connection Failed: ${dbErr?.message || "Check MONGODB_URI in Vercel environment variables."}`,
        },
        { status: 500 }
      );
    }

    let userDoc = await User.findOne({ email: cleanEmail });
    if (!userDoc) {
      userDoc = await User.create({
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
        password: password,
        walletBalance: 0,
      });
      console.log(`✅ [Next.js API - MongoDB Atlas] First-time Login User Created: ${cleanEmail}`);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      { otp, expiresAt, purpose: "login" },
      { upsert: true, new: true }
    );

    let emailSent = false;
    let emailMessage = "";

    const mailRes = await sendDeliverableOtpEmail({
      toEmail: cleanEmail,
      otp,
      purpose: "Login"
    });

    if (mailRes.success) {
      emailSent = true;
      emailMessage = `Security OTP sent to ${cleanEmail}. Please check your email inbox.`;
    } else if (mailRes.demo) {
      emailMessage = `Security OTP sent to ${cleanEmail}. (Code: ${otp})`;
    } else {
      emailMessage = `OTP generated (${otp}). Email delivery notice: ${mailRes.error || "Check mailer configuration"}`;
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
        role: userDoc.role,
      },
    });
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
