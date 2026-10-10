import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await connectDB();

    const deleteResult = await (Product as any).deleteMany({
      category: { $in: ["sim", "SIM", "SIM Offers", "Sim Offers", "sim offer"] },
    });

    return NextResponse.json({
      success: true,
      message: "SIM Offers category has been completely purged from the database.",
      deletedCount: deleteResult.deletedCount || 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to purge SIM offers." },
      { status: 500 }
    );
  }
}
