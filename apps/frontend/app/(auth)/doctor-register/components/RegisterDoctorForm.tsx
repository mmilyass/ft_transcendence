'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerDoctorSchema } from "@/app/schema/doctor-register";
import type { RegisterDoctorForm } from "@/types/doctor-register";

import RegistrationDetails from "./RegistrationDetails";
import ClinicalDetails from "./ClinicalDetails";
import MedicalLicenseUpload from "./MedicalLicenseUpload";

export default function RegisterDoctorForm() {

  const [isLoading, setIsLoading] = useState(false);

  const [medicalLicense, setMedicalLicense] =
    useState<File | null>(null);

  const [
    medicalLicenseError,
    setMedicalLicenseError,
  ] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterDoctorForm>({
    resolver: zodResolver(
      registerDoctorSchema
    ),
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setMedicalLicense(file);
  };

  const onSubmit = async (
    data: RegisterDoctorForm
  ) => {
    console.log(data);
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12">

      <form
        className="space-y-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <RegistrationDetails
          register={register}
          setValue={setValue}
          errors={errors}
        />

        <ClinicalDetails
          register={register}
          errors={errors}
        />

        <MedicalLicenseUpload
          medicalLicense={medicalLicense}
          medicalLicenseError={
            medicalLicenseError
          }
          handleFileChange={
            handleFileChange
          }
        />

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : "Apply to Join"}
        </button>
      </form>
    </div>
  );
}