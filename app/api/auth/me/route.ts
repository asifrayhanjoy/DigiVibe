import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email query parameter is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      await connectDB();
    } catch (dbErr: any) {
      return NextResponse.json(
        { success: false, message: `Database Connection Failed: ${dbErr?.message}` },
        { status: 500 }
      );
    }

    const userDoc = await User.findOne({ email: cleanEmail });

    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: "User profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: `Profile Server Error: ${err?.message}` },
      { status: 500 }
    );
  }
}
