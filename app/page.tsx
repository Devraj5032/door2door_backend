import DataTable from "@/components/DataTable";
import prisma from "@/lib/prisma";

async function getInitialData() {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const data = await prisma.collectionData.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalCount = await prisma.collectionData.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return {
      data: data.map((item: any )=> ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
      pagination: {
        page: 1,
        limit: 20,
        totalCount,
        totalPages: Math.ceil(totalCount / 20),
        hasNextPage: totalCount > 20,
        hasPrevPage: false,
      },
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

export default async function Home() {
  const initialData = await getInitialData();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Collection Data Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your collection data with advanced filtering and pagination
          </p>
        </div>
        
        <DataTable 
          initialData={initialData.data}
          initialPagination={initialData.pagination}
        />
      </div>
    </div>
  );
}
