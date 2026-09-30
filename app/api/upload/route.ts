import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { file, filename, folder } = body;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file content or Base64 string provided." },
        { status: 400 }
      );
    }

    const folderToUse = folder || "digivibe_deliveries";
    console.log(`☁️ [Cloudinary Uploading] Folder: "${folderToUse}", Filename: "${filename || 'unnamed'}"`);

    const uploadRes = await uploadToCloudinary(file, folderToUse, filename);

    console.log(`✅ [Cloudinary Success] Secure URL: ${uploadRes.secure_url}`);

    return NextResponse.json({
      success: true,
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      format: uploadRes.format,
      message: "File uploaded to Cloudinary successfully!",
    });
  } catch (error: any) {
    console.error("❌ API Upload Cloudinary Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload to Cloudinary: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
