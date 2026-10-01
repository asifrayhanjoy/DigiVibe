import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Update from "@/lib/models/Update";

export const dynamic = "force-dynamic";

// GET /api/updates/[id]
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, message: "Update ID is required" }, { status: 400 });
    }

    const filterConditions: any[] = [];
    if (mongoose.Types.ObjectId.isValid(id)) {
      filterConditions.push({ _id: new mongoose.Types.ObjectId(id) });
      filterConditions.push({ _id: id });
    }
    filterConditions.push({ title: id });
    filterConditions.push({ title: decodeURIComponent(id) });

    const doc = await (Update as any).findOne({ $or: filterConditions }).lean();

    if (!doc) {
      return NextResponse.json({ success: false, message: "Update record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, update: doc });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/updates/[id]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, message: "Update ID is required for deletion" }, { status: 400 });
    }

    const filterConditions: any[] = [];
    if (mongoose.Types.ObjectId.isValid(id)) {
      filterConditions.push({ _id: new mongoose.Types.ObjectId(id) });
      filterConditions.push({ _id: id });
    }
    filterConditions.push({ title: id });
    filterConditions.push({ title: decodeURIComponent(id) });

    const deleteResult = await (Update as any).deleteMany({ $or: filterConditions });

    if (!deleteResult || deleteResult.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Update record not found" }, { status: 404 });
    }

    console.log(`🗑️ [MongoDB Atlas] Permanently deleted ${deleteResult.deletedCount} update document(s) via /api/updates/${id}`);

    return NextResponse.json({
      success: true,
      message: `Update entry deleted successfully (${deleteResult.deletedCount} removed)`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error: any) {
    console.error("❌ Error deleting update entry:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
