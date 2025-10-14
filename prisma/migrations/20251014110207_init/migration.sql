-- CreateTable
CREATE TABLE "CollectionData" (
    "id" SERIAL NOT NULL,
    "house_id" TEXT NOT NULL,
    "Image1" TEXT NOT NULL,
    "Image2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Image1_prediction" JSONB NOT NULL,
    "Image2_prediction" JSONB,

    CONSTRAINT "CollectionData_pkey" PRIMARY KEY ("id")
);
