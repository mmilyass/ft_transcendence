/*
  Warnings:

  - You are about to drop the column `Languages` on the `Doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "Languages",
ADD COLUMN     "languages" TEXT[],
ALTER COLUMN "location" DROP DEFAULT;
