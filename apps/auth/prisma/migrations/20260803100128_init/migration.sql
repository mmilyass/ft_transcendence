/*
  Warnings:

  - You are about to drop the column `hide_doctor_button` on the `Doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "hide_doctor_button";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hide_doctor_button" BOOLEAN NOT NULL DEFAULT false;
