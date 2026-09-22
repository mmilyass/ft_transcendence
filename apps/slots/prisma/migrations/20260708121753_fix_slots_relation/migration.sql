-- CreateEnum
CREATE TYPE "SlotsStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Slots" (
    "id" SERIAL NOT NULL,
    "doctor_id" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_booked" BOOLEAN NOT NULL DEFAULT false,
    "status" "SlotsStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Slots" ADD CONSTRAINT "Slots_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
