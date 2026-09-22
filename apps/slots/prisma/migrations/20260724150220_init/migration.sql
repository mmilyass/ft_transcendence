/*
  Warnings:

  - You are about to drop the column `Languages` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `TotalPatients` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `license_number` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `speciality` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Doctor` table. All the data in the column will be lost.
  - The primary key for the `Slots` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Auditlog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Auditlog" DROP CONSTRAINT "Auditlog_user_id_fkey";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "Languages",
DROP COLUMN "TotalPatients",
DROP COLUMN "bio",
DROP COLUMN "experience",
DROP COLUMN "license_number",
DROP COLUMN "location",
DROP COLUMN "profileImage",
DROP COLUMN "rating",
DROP COLUMN "reviewCount",
DROP COLUMN "speciality",
DROP COLUMN "verified";

-- AlterTable
ALTER TABLE "Slots" DROP CONSTRAINT "Slots_pkey",
ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Slots_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Slots_id_seq";

-- DropTable
DROP TABLE "Auditlog";

-- DropTable
DROP TABLE "Stats";

-- AddForeignKey
ALTER TABLE "Slots" ADD CONSTRAINT "Slots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
