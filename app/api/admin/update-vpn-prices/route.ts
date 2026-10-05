import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { vpnTargetSpecs } from "@/server/scripts/smartVpnPriceUpdate";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await connectDB();

    const dbProducts = await (Product as any).find({
      category: { $in: ["vpn", "VPN", "VPN Services"] }
    }).lean();

    const bulkOps: any[] = [];
    const logs: string[] = [];
    let updatedCount = 0;
    let untouchedCount = 0;

    for (const doc of dbProducts) {
      const spec = vpnTargetSpecs.find((s: any) => {
        if (s.id && (doc.productId === s.id || doc.id === s.id)) return true;
        if (s.duration && doc.duration) {
          return doc.title.trim().toLowerCase() === s.title.toLowerCase() && doc.duration === s.duration;
        }
        return doc.title.trim().toLowerCase() === s.title.toLowerCase();
      });

      if (!spec) {
        logs.push(`🛡️ [EXTRA / UNMATCHED] "${doc.title}" (ID: ${doc.productId}) - DB Price: ৳${doc.price} -> REMAINS UNTOUCHED`);
        untouchedCount++;
        continue;
      }

      const currentPrice = Number(doc.price);
      const targetPrice = spec.targetPrice;

      if (currentPrice < targetPrice) {
        bulkOps.push({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { price: targetPrice } }
          }
        });
        logs.push(`✅ [UPDATED] "${doc.title}" (${doc.duration || ''}) - Old DB Price: ৳${currentPrice} <= Target: ৳${targetPrice} -> NEW PRICE: ৳${targetPrice}`);
        updatedCount++;
      } else {
        logs.push(`🛡️ [ALREADY HIGHER / UNTOUCHED] "${doc.title}" (${doc.duration || ''}) - Current DB Price: ৳${currentPrice} >= Target: ৳${targetPrice} -> REMAINS UNTOUCHED`);
        untouchedCount++;
      }
    }

    if (bulkOps.length > 0) {
      await (Product as any).bulkWrite(bulkOps);
    }

    return NextResponse.json({
      success: true,
      message: `Smart VPN price update completed successfully (+6 BDT applied).`,
      stats: {
        totalVpnCards: dbProducts.length,
        updatedCount,
        untouchedCount,
      },
      logs
    });
  } catch (error: any) {
    console.error("POST /api/admin/update-vpn-prices error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update VPN prices: " + error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
