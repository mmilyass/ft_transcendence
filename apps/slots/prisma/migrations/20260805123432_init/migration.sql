/*
  Warnings:

  - Made the column `doctor_id` on table `Slots` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Slots" DROP CONSTRAINT "Slots_doctor_id_fkey";

-- AlterTable
ALTER TABLE "Slots" ALTER COLUMN "doctor_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Slots" ADD CONSTRAINT "Slots_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
