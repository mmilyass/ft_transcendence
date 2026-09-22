"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SettingsSection from "./SettingsSection";

export default function ProfessionalSettings() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    specialty: "",
    licenseNumber: "",
    yearsOfExperience: "",
    consultationFee: "",
    clinicName: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.patch(
        process.env.NEXT_PUBLIC_URL + "/doctor/professional-info",
        {
          specialty: formData.specialty,
          licenseNumber: formData.licenseNumber,
          yearsOfExperience: Number(
            formData.yearsOfExperience
          ),
          consultationFee: Number(
            formData.consultationFee
          ),
          clinicName: formData.clinicName,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        "Professional information updated successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update information"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsSection
      title="Professional Information"
      description="Manage your medical credentials and professional details."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Specialty
          </label>

          <input
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            type="text"
            placeholder="Cardiology"
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            License Number
          </label>

          <input
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            type="text"
            placeholder="MED-123456"
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Years of Experience
          </label>

          <input
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            type="number"
            placeholder="10"
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Consultation Fee
          </label>

          <input
            name="consultationFee"
            value={formData.consultationFee}
            onChange={handleChange}
            type="number"
            placeholder="300"
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium">
            Clinic / Hospital
          </label>

          <input
            name="clinicName"
            value={formData.clinicName}
            onChange={handleChange}
            type="text"
            placeholder="Casablanca Medical Center"
            className="w-full px-4 py-3 rounded-xl border border-outline/20 bg-surface"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </SettingsSection>
  );
}