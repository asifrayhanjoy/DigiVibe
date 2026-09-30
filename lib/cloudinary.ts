import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "mravthxk",
  api_key: process.env.CLOUDINARY_API_KEY || "429895721184622",
  api_secret: process.env.CLOUDINARY_API_SECRET || "CnBURhiDTdnWZFpVPdWYXf2yIfw",
  secure: true,
});

export default cloudinary;

/**
 * Upload binary file, Base64 data URL, or archive (.zip, .apk, .pdf, .ovpn, images) to Cloudinary
 * Uses resource_type: "auto" so all multi-format files return a valid Cloudinary secure_url.
 */
export async function uploadToCloudinary(
  fileStr: string,
  folder: string = "digivibe_assets",
  filename?: string
): Promise<{ secure_url: string; public_id: string; format: string }> {
  try {
    const options: any = {
      folder,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
    };

    if (filename) {
      const cleanName = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
      options.public_id = `${cleanName}_${Date.now()}`;
    }

    const result = await cloudinary.uploader.upload(fileStr, options);
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format || "auto",
    };
  } catch (error: any) {
    console.error("❌ Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed: " + (error.message || "Unknown error"));
  }
}
