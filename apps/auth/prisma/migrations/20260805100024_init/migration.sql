/*
  Warnings:

  - You are about to drop the column `totalAppointments` on the `DoctorPatient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalAppointments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPatients" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "DoctorPatient" DROP COLUMN "totalAppointments";
