import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Asset from "@/lib/models/Asset";

// 1. POST /api/orders - Create a new order with "Pending" status in MongoDB
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const { items, totalAmount, paymentMethod, trxId, customerPhone, customerEmail, userEmail } = body;

    const emailToUse = (userEmail || customerEmail || "mdasifrayhanjoy2@gmail.com").toLowerCase();
    const generatedOrderId = "DV-" + Math.floor(100000 + Math.random() * 900000);

    const newOrder: any = await (Order as any).create({
      orderId: generatedOrderId,
      userEmail: emailToUse,
      customerEmail: emailToUse,
      customerPhone: customerPhone || "",
      items: items || [],
      totalAmount: Number(totalAmount) || 0,
      paymentMethod: paymentMethod || "bKash",
      trxId: trxId || "",
      status: "Pending",
    });

    console.log(`📦 [MongoDB Atlas] Direct Order Saved: #${newOrder.orderId} for ${emailToUse} (Status: Pending)`);

    return NextResponse.json({
      success: true,
      orderId: newOrder.orderId,
      fulfillmentStatus: "pending",
      estimatedFulfillmentTime: "Within 5 Minutes",
      message: "Order placed successfully! Waiting for admin approval.",
      order: newOrder,
    });
  } catch (error: any) {
    console.error("❌ Error creating order in MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save order to MongoDB: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}

// 2. GET /api/orders - Fetch user orders or all admin orders directly from MongoDB
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const isAdminQuery = searchParams.get("admin") === "true";

    const query: any = {};
    if (!isAdminQuery && email) {
      query.userEmail = email.toLowerCase();
    }

    const orders = await (Order as any).find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });
  } catch (error: any) {
    console.error("❌ Error fetching orders from MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders from database: " + error.message,
        orders: [],
      },
      { status: 500 }
    );
  }
}

// 3. PUT / PATCH /api/orders - Update order status (Approve / Reject) in MongoDB
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "orderId and status are required" },
        { status: 400 }
      );
    }

    const updatedOrder: any = await (Order as any).findOneAndUpdate(
      { orderId: orderId },
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: `Order #${orderId} not found` },
        { status: 404 }
      );
    }

    // If order approved (Completed), create active digital assets in MongoDB if items exist
    if (status === "Completed" && updatedOrder.items && updatedOrder.items.length > 0) {
      for (const item of updatedOrder.items) {
        const title = item.title || "Digital Service";
        const category = item.category || "Digital Service";
        const generatedCreds = `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Math.floor(
          100 + Math.random() * 900
        )}@digivibe.com | Pass: DV#${Math.floor(1000 + Math.random() * 9000)}!`;

        await (Asset as any).create({
          orderId: updatedOrder.orderId,
          userEmail: updatedOrder.userEmail,
          title,
          category,
          credentials: generatedCreds,
          status: "Active",
        });
      }
    }

    console.log(`✅ [MongoDB Atlas] Order #${orderId} Status Updated to '${status}'`);

    return NextResponse.json({
      success: true,
      message: `Order #${orderId} status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("❌ Error updating order status:", error);
    return NextResponse.json(
      { success: false, message: "Error updating order: " + error.message },
      { status: 500 }
    );
  }
}

// Also support PATCH for status updates
export async function PATCH(request: Request) {
  return PUT(request);
}

// 4. DELETE /api/orders - Delete order from MongoDB
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId query param required" },
        { status: 400 }
      );
    }

    await (Order as any).deleteOne({ orderId: orderId });
    console.log(`🗑️ [MongoDB Atlas] Deleted Order #${orderId}`);

    return NextResponse.json({
      success: true,
      message: `Order #${orderId} removed from database`,
    });
  } catch (error: any) {
    console.error("❌ Error deleting order:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting order: " + error.message },
      { status: 500 }
    );
  }
}
