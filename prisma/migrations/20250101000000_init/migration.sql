-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3),
    "gender" INTEGER,
    "ethnicity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dateTesting" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_clientId_key" ON "Patient"("clientId");

-- CreateIndex
CREATE INDEX "Patient_createdAt_idx" ON "Patient"("createdAt");

-- CreateIndex
CREATE INDEX "Observation_patientId_dateTesting_idx" ON "Observation"("patientId", "dateTesting");

-- CreateIndex
CREATE UNIQUE INDEX "Observation_patientId_dateTesting_key" ON "Observation"("patientId", "dateTesting");

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
