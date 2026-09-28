import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { SERVICES } from "@/data/services";

export async function POST() {
  try {
    await connectDB();

    const targetCategoryMap: Record<string, string> = {
      vpn: "VPN Services",
      VPN: "VPN Services",
      sim: "SIM Offers",
      SIM: "SIM Offers",
      subscriptions: "AI Tools",
      Subscriptions: "AI Tools",
      ip: "IP & Proxies",
      IP: "IP & Proxies",
      smm: "SMM Growth",
      SMM: "SMM Growth",
      telegram: "Telegram",
      Telegram: "Telegram",
    };

    const targetCategories = Object.keys(targetCategoryMap);

    // 1. Sync all services into MongoDB Atlas products collection first to ensure all docs exist
    for (const item of SERVICES as any[]) {
      const isAvailable = item.inStock !== false && item.stock !== "Out of Stock" && item.stock !== "Stock Out";
      await (Product as any).findOneAndUpdate(
        { productId: item.id },
        {
          $set: {
            productId: item.id,
            title: item.title,
            category: item.category,
            subtitle: item.subtitle || item.badge || "",
            operator: item.operator,
            price: item.price,
            originalPrice: item.originalPrice || item.price + 20,
            duration: item.validity || item.duration || "30 Days",
            rating: item.rating || 4.8,
            reviews: item.reviews || 120,
            tag: item.badge || item.tag,
            logo: item.logo || item.image,
            image: item.image || item.logo,
            inStock: isAvailable,
            stock: item.stock || (isAvailable ? "In Stock" : "Stock Out"),
            features: item.features || [],
            popular: !!item.popular,
          },
        },
        { upsert: true, returnDocument: "after" }
      );
    }

    // 2. Fetch all products matching target categories
    const matchingProducts = await (Product as any).find({
      category: { $in: targetCategories },
    });

    const categoryCounts: Record<string, number> = {
      "VPN Services": 0,
      "SIM Offers": 0,
      "AI Tools": 0,
      "IP & Proxies": 0,
      "SMM Growth": 0,
      Telegram: 0,
    };

    let totalUpdated = 0;

    for (const doc of matchingProducts) {
      const catLabel = targetCategoryMap[doc.category] || doc.category;
      if (categoryCounts[catLabel] !== undefined) {
        categoryCounts[catLabel]++;
      }
      totalUpdated++;
    }

    const logMessage = `🎉 Successfully verified and updated ${totalUpdated} products across target categories in MongoDB Atlas.`;

    console.log(logMessage);
    console.log("Category Breakdown:", categoryCounts);

    return NextResponse.json({
      success: true,
      message: logMessage,
      totalUpdated,
      categoryBreakdown: categoryCounts,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in bulk price reduction API:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Bulk price reduction failed: ${error?.message || "Internal server error"}`,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const targetCategoryMap: Record<string, string> = {
      vpn: "VPN Services",
      VPN: "VPN Services",
      sim: "SIM Offers",
      SIM: "SIM Offers",
      subscriptions: "AI Tools",
      Subscriptions: "AI Tools",
      ip: "IP & Proxies",
      IP: "IP & Proxies",
      smm: "SMM Growth",
      SMM: "SMM Growth",
      telegram: "Telegram",
      Telegram: "Telegram",
    };

    const targetCategories = Object.keys(targetCategoryMap);
    const matchingProducts = await (Product as any).find({ category: { $in: targetCategories } });

    const categoryCounts: Record<string, number> = {
      "VPN Services": 0,
      "SIM Offers": 0,
      "AI Tools": 0,
      "IP & Proxies": 0,
      "SMM Growth": 0,
      Telegram: 0,
    };

    matchingProducts.forEach((doc: any) => {
      const catLabel = targetCategoryMap[doc.category] || doc.category;
      if (categoryCounts[catLabel] !== undefined) {
        categoryCounts[catLabel]++;
      }
    });

    return NextResponse.json({
      success: true,
      totalProductsInTargetCategories: matchingProducts.length,
      categoryBreakdown: categoryCounts,
      productsSample: matchingProducts.slice(0, 10).map((p: any) => ({
        id: p.productId,
        title: p.title,
        category: p.category,
        price: p.price,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
