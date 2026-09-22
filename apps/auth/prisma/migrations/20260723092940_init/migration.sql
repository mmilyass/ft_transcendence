/*
  Warnings:

  - You are about to drop the `Slots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Slots" DROP CONSTRAINT "Slots_doctor_id_fkey";

-- DropTable
DROP TABLE "Slots";

-- DropEnum
DROP TYPE "SlotsStatus";
