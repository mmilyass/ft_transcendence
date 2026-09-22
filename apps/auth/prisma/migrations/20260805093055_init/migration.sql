/*
  Warnings:

  - You are about to drop the column `CompletedAppointments` on the `Doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "CompletedAppointments";

-- AlterTable
ALTER TABLE "DoctorPatient" ADD COLUMN     "totalAppointments" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "DoctorPatient" ADD CONSTRAINT "DoctorPatient_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
