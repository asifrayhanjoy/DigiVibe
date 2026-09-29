import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Otp from "@/lib/models/Otp";
import { sendDeliverableOtpEmail } from "@/lib/emailService";

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

    let emailSent = false;
    let emailMessage = "";

    const mailRes = await sendDeliverableOtpEmail({
      toEmail: cleanEmail,
      otp,
      purpose: "Registration"
    });

    if (mailRes.success) {
      emailSent = true;
      emailMessage = `Security OTP sent to ${cleanEmail}. Please check your email inbox.`;
    } else if (mailRes.demo) {
      emailMessage = `Security OTP code sent to ${cleanEmail}. (Code: ${otp})`;
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
