-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "salePrice" REAL;
ALTER TABLE "Lead" ADD COLUMN "soldAt" DATETIME;
ALTER TABLE "Lead" ADD COLUMN "soldTo" TEXT;

-- CreateTable
CREATE TABLE "RevenueGoal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "leadGoal" INTEGER NOT NULL,
    "revenueGoal" REAL NOT NULL,
    "leadsAchieved" INTEGER NOT NULL DEFAULT 0,
    "revenueAchieved" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RevenueGoal_year_month_key" ON "RevenueGoal"("year", "month");
