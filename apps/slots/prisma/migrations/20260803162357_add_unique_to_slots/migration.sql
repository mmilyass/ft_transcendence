/*
  Warnings:

  - A unique constraint covering the columns `[doctor_id,date,start_time]` on the table `Slots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Slots_doctor_id_date_start_time_key" ON "Slots"("doctor_id", "date", "start_time");
