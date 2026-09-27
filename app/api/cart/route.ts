import { NextResponse } from "next/server";

let serverCartStore: Record<string, any[]> = {};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "default_user";
  const items = serverCartStore[email] || [];
  return NextResponse.json({ success: true, items });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email || "default_user";
    const items = body.items || [];
    serverCartStore[email] = items;
    return NextResponse.json({ success: true, items: serverCartStore[email] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "default_user";
  serverCartStore[email] = [];
  return NextResponse.json({ success: true, items: [] });
}
