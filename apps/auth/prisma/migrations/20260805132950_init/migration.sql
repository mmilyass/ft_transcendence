-- CreateIndex
CREATE INDEX "Auditlog_user_id_action_idx" ON "Auditlog"("user_id", "action");

-- CreateIndex
CREATE INDEX "Doctor_user_id_speciality_location_idx" ON "Doctor"("user_id", "speciality", "location");

-- CreateIndex
CREATE INDEX "DoctorPatient_doctor_id_patient_id_idx" ON "DoctorPatient"("doctor_id", "patient_id");

-- CreateIndex
CREATE INDEX "Notification_user_id_isRead_idx" ON "Notification"("user_id", "isRead");

-- CreateIndex
CREATE INDEX "Review_doctorId_userId_idx" ON "Review"("doctorId", "userId");

-- CreateIndex
CREATE INDEX "Stats_TotalUsers_TotalDoctors_TotalAppointments_idx" ON "Stats"("TotalUsers", "TotalDoctors", "TotalAppointments");

-- CreateIndex
CREATE INDEX "User_email_name_idx" ON "User"("email", "name");

-- CreateIndex
CREATE INDEX "UserStats_user_id_idx" ON "UserStats"("user_id");
