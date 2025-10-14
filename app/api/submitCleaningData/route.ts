import { processImage } from "@/Services/uploadImage";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const house_id = formData.get("house_id") as string;
    const image1 = formData.get("image1") as File;
    const image2 = formData.get("image2") as File | null;

    // Process images
    const { image: image1URL, classes: image1Prediction } = await processImage(
      image1
    );
    let image2URL: string | null = null;
    let image2Prediction: any = null;

    if (image2) {
      const result = await processImage(image2);
      image2URL = result.image;
      image2Prediction = result.classes;
    }

    // Save to database
    const savedData = await prisma.collectionData.create({
      data: {
        house_id,
        Image1: image1URL,
        Image2: image2URL || undefined,
        Image1_prediction: image1Prediction,
        Image2_prediction: image2Prediction || undefined,
      },
    });

    return NextResponse.json({
      message: "Data saved successfully",
      data: savedData
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
