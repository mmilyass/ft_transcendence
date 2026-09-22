-- DropForeignKey
ALTER TABLE "Auditlog" DROP CONSTRAINT "Auditlog_user_id_fkey";

-- AlterTable
ALTER TABLE "Auditlog" ADD COLUMN     "details" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Auditlog" ADD CONSTRAINT "Auditlog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
