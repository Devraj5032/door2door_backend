import { uploadImageCloudinary } from "@/lib/cloudinary";
import { getRoboflowResults } from "@/lib/roboflow";

/**
 * Accepts a File object from Next.js formData
 */
export async function processImage(file: File) {
  console.log("Image received:", file);

  // Convert File to Base64
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  // Upload to Cloudinary
  const imageURL = await uploadImageCloudinary(base64);

  // Get AI predictions
  const getAiClasses = await getRoboflowResults(imageURL);

  return {
    image: imageURL,
    classes: getAiClasses,
  };
}
