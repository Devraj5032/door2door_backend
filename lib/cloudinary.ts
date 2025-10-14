import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDNARY_API_KEY!,
  api_secret: process.env.CLOUDNARY_SECRET!,
});

export async function uploadImageCloudinary(image: string) {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "door2door",
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Error saving image to Cloudinary");
  }
}
