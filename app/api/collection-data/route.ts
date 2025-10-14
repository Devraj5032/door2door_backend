import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const date = searchParams.get("date");
    const houseId = searchParams.get("house_id");
    
    // Calculate offset for pagination
    const skip = (page - 1) * limit;
    
    // Build where clause for filtering
    const where: any = {};
    
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      where.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    }
    
    // Filter by house_id if provided
    if (houseId) {
      where.house_id = houseId;
    }
    
    // Get total count for pagination
    const totalCount = await prisma.collectionData.count({ where });
    
    // Fetch data with pagination
    const data = await prisma.collectionData.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert dates to ISO strings for JSON serialization
    const formattedData = data.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    }));
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      data: formattedData,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching collection data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
