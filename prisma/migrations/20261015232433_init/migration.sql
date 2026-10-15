-- CreateTable
CREATE TABLE "PriceObservation" (
    "id" TEXT NOT NULL,
    "supermarket" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "searchTerm" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION,
    "unitPriceLabel" TEXT,
    "packageSize" TEXT,
    "sourceUrl" TEXT,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceObservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PriceObservation_searchTerm_supermarket_idx" ON "PriceObservation"("searchTerm", "supermarket");
