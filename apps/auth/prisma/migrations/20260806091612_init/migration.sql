/*
  Warnings:

  - You are about to drop the column `TotalPatients` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Doctor` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Doctor_user_id_speciality_location_idx";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "TotalPatients",
DROP COLUMN "location";

-- CreateTable
CREATE TABLE "DoctorLocation" (
    "id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Doctor_user_id_speciality_verified_idx" ON "Doctor"("user_id", "speciality", "verified");

-- AddForeignKey
ALTER TABLE "DoctorLocation" ADD CONSTRAINT "DoctorLocation_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
