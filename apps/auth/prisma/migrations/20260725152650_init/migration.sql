/*
  Warnings:

  - Added the required column `medical_license_url` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "medical_license_url" TEXT NOT NULL;
