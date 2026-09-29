import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Asset from "@/lib/models/Asset";
import Order from "@/lib/models/Order";

// GET /api/assets?email=user@example.com - Fetch User Digital Assets & Approved Deliverables directly from MongoDB Atlas
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required", assets: [] }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase();

    // 1. Query Real MongoDB Atlas Asset Collection
    let rawAssets = await (Asset as any).find({ userEmail: cleanEmail }).sort({ createdAt: -1 });
    let assets = rawAssets ? rawAssets.map((a: any) => (a.toObject ? a.toObject() : { ...a })) : [];

    // 2. Fetch all Completed Orders for this user from MongoDB Atlas
    const completedOrders = await (Order as any).find({
      userEmail: cleanEmail,
      status: "Completed"
    }).sort({ createdAt: -1 });

    const completedOrdersMap = new Map<string, any>();
    if (completedOrders && completedOrders.length > 0) {
      for (const ord of completedOrders) {
        const ordObj = ord.toObject ? ord.toObject() : ord;
        if (ordObj.orderId) {
          completedOrdersMap.set(ordObj.orderId, ordObj);
        }
      }
    }

    const trackedOrderIds = new Set<string>();

    // 3. Enrich existing assets with attached files, images, and notes from Completed Orders
    for (const ast of assets) {
      if (ast.orderId) {
        trackedOrderIds.add(ast.orderId);
        const matchingOrd = completedOrdersMap.get(ast.orderId);
        if (matchingOrd) {
          if ((!ast.deliveryFiles || ast.deliveryFiles.length === 0) && matchingOrd.deliveryFiles && matchingOrd.deliveryFiles.length > 0) {
            ast.deliveryFiles = matchingOrd.deliveryFiles;
          }
          if (!ast.deliveryNotes && matchingOrd.deliveryNotes) {
            ast.deliveryNotes = matchingOrd.deliveryNotes;
          }
          if (matchingOrd.customCredentials && (!ast.credentials || ast.credentials.includes("Standard Digital Access"))) {
            ast.credentials = matchingOrd.customCredentials;
          }
        }
      }
    }

    // 4. Synthesize assets for any Completed Orders not yet present in Asset collection
    if (completedOrders && completedOrders.length > 0) {
      for (const ord of completedOrders) {
        const ordObj = ord.toObject ? ord.toObject() : ord;
        if (!trackedOrderIds.has(ordObj.orderId)) {
          const itemTitle = ordObj.items && ordObj.items.length > 0 ? ordObj.items[0].title : "Digital Service Item";
          const category = ordObj.items && ordObj.items.length > 0 ? (ordObj.items[0].category || "Digital Service") : "Digital Service";

          assets.push({
            _id: ordObj._id || ordObj.orderId,
            id: ordObj.orderId,
            orderId: ordObj.orderId,
            userEmail: cleanEmail,
            title: itemTitle,
            category: category,
            credentials: ordObj.customCredentials || ordObj.deliveryNotes || "Standard Digital Access Granted",
            deliveryNotes: ordObj.deliveryNotes || "",
            deliveryFiles: ordObj.deliveryFiles || [],
            status: "Active",
            createdAt: ordObj.createdAt || new Date()
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      assets: assets || [],
    });
  } catch (error: any) {
    console.error("❌ Error fetching digital assets from MongoDB Atlas:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch assets from database: " + error.message,
        assets: [],
      },
      { status: 500 }
    );
  }
}
