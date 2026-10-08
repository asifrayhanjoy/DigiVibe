import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, message: "OTP verification system has been permanently disabled." },
    { status: 400 }
  );
}


