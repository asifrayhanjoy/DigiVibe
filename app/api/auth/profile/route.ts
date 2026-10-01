import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, name, phone, whatsapp, address, avatar, password } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email is required to update profile." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      await connectDB();
    } catch (dbErr: any) {
      console.error("❌ MongoDB Atlas connection failure during profile update:", dbErr);
      return NextResponse.json(
        {
          success: false,
          message: `Database Connection Failed: ${dbErr?.message || "Check MONGODB_URI in environment variables."}`,
        },
        { status: 500 }
      );
    }

    let userDoc = await User.findOne({ email: cleanEmail });

    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: "User not found in database." },
        { status: 404 }
      );
    }

    // Update only provided fields
    if (name !== undefined) userDoc.name = name;
    if (phone !== undefined) userDoc.phone = phone;
    if (whatsapp !== undefined) userDoc.whatsapp = whatsapp;
    if (address !== undefined) userDoc.address = address;
    if (avatar !== undefined) userDoc.avatar = avatar;
    if (password !== undefined && password.trim().length > 0) userDoc.password = password;

    await userDoc.save();

    console.log(`✅ [MongoDB Atlas] User Profile updated permanently for: ${cleanEmail}`);

    const updatedUser = {
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
    };

    return NextResponse.json({
      success: true,
      message: "Profile updated and saved to MongoDB Atlas successfully!",
      user: updatedUser,
    });
  } catch (err: any) {
    console.error("❌ Profile Update API Server Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: `Profile Update Error: ${err?.message || "Internal server error during profile update."}`,
      },
      { status: 500 }
    );
  }
}
