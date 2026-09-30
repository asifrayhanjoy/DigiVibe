import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Update from "@/lib/models/Update";

// 1. GET /api/updates - Fetch all daily updates sorted by pinned & createdAt
export async function GET() {
  try {
    await connectDB();
    const updates = await (Update as any).find({}).sort({ isPinned: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      updates: updates || [],
    });
  } catch (error: any) {
    console.error("❌ Error fetching updates from MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch updates: " + (error.message || "Unknown error"),
        updates: [],
      },
      { status: 500 }
    );
  }
}

// 2. POST /api/updates - Create a new daily update (Admin CRUD)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      title,
      description,
      category,
      bannerImage,
      badgeText,
      cards,
      files,
      isPinned,
      author,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required." },
        { status: 400 }
      );
    }

    const newUpdate = await (Update as any).create({
      title,
      description,
      category: category || "Daily Announcement",
      bannerImage: bannerImage || "",
      badgeText: badgeText || "NEW UPDATE",
      cards: cards || [],
      files: files || [],
      isPinned: Boolean(isPinned),
      author: author || "Master Admin",
    });

    console.log(`📌 [MongoDB Atlas] Created Today's Update: "${newUpdate.title}" (ID: ${newUpdate._id})`);

    return NextResponse.json({
      success: true,
      message: "Daily Update published successfully!",
      update: newUpdate,
    });
  } catch (error: any) {
    console.error("❌ Error creating update in MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to publish update: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}

// 3. PUT /api/updates - Edit existing update
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, title, description, category, bannerImage, badgeText, cards, files, isPinned } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Update ID is required" },
        { status: 400 }
      );
    }

    const updated = await (Update as any).findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          category,
          bannerImage,
          badgeText,
          cards: cards || [],
          files: files || [],
          isPinned: Boolean(isPinned),
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Update record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Daily update updated successfully!",
      update: updated,
    });
  } catch (error: any) {
    console.error("❌ Error updating record in MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update record: " + error.message,
      },
      { status: 500 }
    );
  }
}

// 4. DELETE /api/updates?id=... - Delete obsolete update entry
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Update ID is required for deletion." },
        { status: 400 }
      );
    }

    const deleted = await (Update as any).findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Update record not found." },
        { status: 404 }
      );
    }

    console.log(`🗑️ [MongoDB Atlas] Deleted Today's Update ID: ${id}`);

    return NextResponse.json({
      success: true,
      message: "Daily update entry deleted successfully from database!",
      deletedId: id,
    });
  } catch (error: any) {
    console.error("❌ Error deleting update from MongoDB:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete update: " + error.message,
      },
      { status: 500 }
    );
  }
}
