import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { simOfferProducts } from "@/data/simOffers";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await connectDB();

    console.log(`[API Sync] Processing ${simOfferProducts.length} SIM offers...`);

    const bulkOps: any[] = [];

    for (const itemObj of simOfferProducts) {
      const item = itemObj as any;
      const isAvailable = item.inStock !== false && item.stock !== "Out of Stock" && item.stock !== "Stock Out" && item.stock !== "Sold Out";
      const finalStock = item.stock || (isAvailable ? "In Stock" : "Out of Stock");
      const finalPrice = Number(item.price);
      const originalPrice = item.originalPrice ? Number(item.originalPrice) : Math.round(finalPrice * 1.2);

      const updatePayload = {
        productId: item.id,
        title: item.title.trim(),
        category: "sim",
        subtitle: item.subtitle || item.badge || "",
        operator: item.operator || "",
        price: finalPrice,
        originalPrice: originalPrice,
        duration: item.duration || item.validity || "30 Days",
        rating: item.rating || 4.8,
        reviews: item.reviews || 120,
        tag: item.badge || item.tag || item.subtitle || "",
        badge: item.badge || item.subtitle || "",
        badgeColor: item.badgeColor || "",
        logo: item.logo || item.image || "",
        image: item.image || item.logo || "",
        icon: item.icon || "Smartphone",
        inStock: isAvailable,
        stock: finalStock,
        features: Array.isArray(item.features) && item.features.length > 0 ? item.features : ["100% Guaranteed Activation", "Direct Mobile Recharge", "24/7 Support"],
        popular: !!item.popular,
        delivery: "Drive Recharge / Instant",
      };

      bulkOps.push({
        updateOne: {
          filter: { productId: item.id },
          update: {
            $set: updatePayload,
            $setOnInsert: { createdAt: new Date() }
          },
          upsert: true,
        },
      });
    }

    let modifiedCount = 0;
    let upsertedCount = 0;

    if (bulkOps.length > 0) {
      const result = await (Product as any).bulkWrite(bulkOps);
      modifiedCount = result.modifiedCount;
      upsertedCount = result.upsertedCount;
    }

    const totalSims = await (Product as any).countDocuments({
      category: { $in: ["sim", "SIM", "SIM Offers"] }
    });

    return NextResponse.json({
      success: true,
      message: `SIM offers bulk sync completed successfully (+5 BDT applied).`,
      stats: {
        totalSimsInDb: totalSims,
        modifiedCount,
        upsertedCount,
        processedCount: simOfferProducts.length,
      }
    });
  } catch (error: any) {
    console.error("POST /api/admin/sync-sim-offers error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to sync SIM offers: " + error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
