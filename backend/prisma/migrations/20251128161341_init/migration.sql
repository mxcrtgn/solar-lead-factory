-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OPS',
    "avatar" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internalName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SOURCING',
    "commune" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "coordinates" TEXT NOT NULL,
    "cadastreRefs" TEXT,
    "surfaceHa" REAL NOT NULL,
    "qualityScore" INTEGER,
    "completeness" INTEGER NOT NULL DEFAULT 0,
    "estimatedMWc" REAL,
    "estimatedTRI" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    "assignedToId" TEXT,
    CONSTRAINT "Lead_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sourcing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "identifiedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "satelliteImages" TEXT,
    "slope" REAL,
    "landUse" TEXT,
    "access" BOOLEAN NOT NULL DEFAULT false,
    "shading" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sourcing_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Regulatory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "pluZone" TEXT,
    "pluCompatible" BOOLEAN,
    "pluDocumentUrl" TEXT,
    "natura2000" TEXT,
    "natura2000Distance" INTEGER,
    "natura2000Name" TEXT,
    "monumentsHistoriques" TEXT,
    "mhDistance" INTEGER,
    "floodZone" TEXT,
    "znieff" BOOLEAN NOT NULL DEFAULT false,
    "landClassification" TEXT,
    "cdpenafRisk" TEXT,
    "riskScore" INTEGER,
    "estimatedPermitMonths" INTEGER,
    "localProjects" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Regulatory_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Technical" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "irradiationSource" TEXT,
    "ghi" REAL,
    "productionSpecific" REAL,
    "monthlyDistribution" TEXT,
    "p50" REAL,
    "p75" REAL,
    "p90" REAL,
    "slopeAvg" REAL,
    "slopeMax" REAL,
    "orientation" TEXT,
    "altitude" REAL,
    "shadingSources" TEXT,
    "shadingLoss" REAL,
    "soilType" TEXT,
    "soilRisk" TEXT,
    "costImpact" TEXT,
    "targetMWc" REAL,
    "technology" TEXT,
    "usableSurfaceRatio" REAL,
    "panelCount" INTEGER,
    "annualProductionP50" REAL,
    "performanceRatio" REAL,
    "layoutPlanUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Technical_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Network" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "substationName" TEXT,
    "operator" TEXT,
    "voltage" TEXT,
    "distanceKm" REAL,
    "s3renrDate" DATETIME,
    "totalCapacityMVA" REAL,
    "reservedMW" REAL,
    "availableMW" REAL,
    "queueCount" INTEGER,
    "queueMW" REAL,
    "connectionType" TEXT,
    "complexity" TEXT,
    "tracePath" TEXT,
    "fixedCost" REAL,
    "linearCostPerKm" REAL,
    "totalConnectionCost" REAL,
    "costPerMWc" REAL,
    "ptfMonths" INTEGER,
    "studyMonths" INTEGER,
    "workMonths" INTEGER,
    "totalDelayMonths" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Network_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Foncier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "ownerIdentified" BOOLEAN NOT NULL DEFAULT false,
    "ownerType" TEXT,
    "ownerNameEnc" TEXT,
    "ownerEmailEnc" TEXT,
    "ownerPhoneEnc" TEXT,
    "contactStatus" TEXT,
    "contactHistory" TEXT,
    "transactionType" TEXT,
    "leaseDurationYears" INTEGER,
    "rentPerHaYear" REAL,
    "totalRentYear" REAL,
    "salePrice" REAL,
    "servitudes" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Foncier_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Economic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "operationYears" INTEGER NOT NULL DEFAULT 25,
    "discountRate" REAL NOT NULL DEFAULT 6,
    "inflationRate" REAL NOT NULL DEFAULT 2,
    "degradationRate" REAL NOT NULL DEFAULT 0.5,
    "capexPanels" REAL,
    "capexInverters" REAL,
    "capexStructures" REAL,
    "capexCivilWorks" REAL,
    "capexConnection" REAL,
    "capexStudies" REAL,
    "capexMOE" REAL,
    "capexContingency" REAL,
    "totalCapex" REAL,
    "opexOM" REAL,
    "opexInsurance" REAL,
    "opexLease" REAL,
    "opexAssetMgmt" REAL,
    "opexIFER" REAL,
    "opexTaxes" REAL,
    "totalOpexYear" REAL,
    "revenueScheme" TEXT,
    "electricityPrice" REAL,
    "contractYears" INTEGER,
    "annualRevenueYear1" REAL,
    "tri" REAL,
    "van" REAL,
    "paybackYears" REAL,
    "lcoe" REAL,
    "sensitivityData" TEXT,
    "excelModelUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Economic_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "section" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Comment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "linkUrl" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_internalName_key" ON "Lead"("internalName");

-- CreateIndex
CREATE UNIQUE INDEX "Sourcing_leadId_key" ON "Sourcing"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Regulatory_leadId_key" ON "Regulatory"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Technical_leadId_key" ON "Technical"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Network_leadId_key" ON "Network"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Foncier_leadId_key" ON "Foncier"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Economic_leadId_key" ON "Economic"("leadId");
