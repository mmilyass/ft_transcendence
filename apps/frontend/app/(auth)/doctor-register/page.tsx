'use client';

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import InformationFooter from "@/components/InformationFooter";
import DoctorRegisterHero from "./components/DoctorRegisterHero";
import RegistrationDetailsSection from "./components/RegistrationDetails";
import ClinicalDetails from "./components/ClinicalDetails";
import MedicalLicenseUpload from "./components/MedicalLicenseUpload";
import SubmitSection from "./components/Submit";
import { registerDoctorSchema } from "@/app/schema/doctor-register";
import { RegisterDoctorForm } from "@/types/doctor-register";
import { useAuth } from "@/app/layout";

function RegisterDoctor() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterDoctorForm>({
    resolver: zodResolver(registerDoctorSchema),
  });

  const { user, loading} = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [medicalLicense, setMedicalLicense] =
    useState<File | null>(null);
  const [medicalLicenseError, setMedicalLicenseError] =
    useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("You must be logged in to register as a doctor");
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    setMedicalLicenseError(null);

    if (!file) {
      setMedicalLicense(null);
      return;
    }

    const validTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];

    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setMedicalLicenseError(
        "File must be PDF, PNG, or JPG"
      );
      setMedicalLicense(null);
      return;
    }

    if (file.size > maxSize) {
      setMedicalLicenseError(
        "File size must not exceed 10MB"
      );
      setMedicalLicense(null);
      return;
    }

    setMedicalLicense(file);
  };

  const onSubmit = async (
    data: RegisterDoctorForm
  ) => {
    if (!medicalLicense) {
      setMedicalLicenseError(
        "Medical license file is required"
      );
      return;
    }

    setIsLoading(true);

    try {
      const payload = new FormData();

      payload.append("name", data.name);
      payload.append("email", data.email);
      payload.append("location", JSON.stringify(data.location));
      data.languages.forEach((language) => {
        payload.append("languages", language);
      });
      payload.append("speciality", data.speciality);
      payload.append(
        "license_number",
        data.license_number
      );
      payload.append(
        "experience",
        String(data.experience)
      );
      payload.append("bio", data.bio);
      payload.append("phone", data.phone);
      payload.append(
        "medical_license",
        medicalLicense
      );

      const { data: responseData } =
        await axios.post(
          process.env.NEXT_PUBLIC_URL + "/auth/doctor-register",
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

      toast.success(
        responseData.message ||
          "Registration successful! Please check your email to verify your account."
      );

      setMedicalLicense(null);

      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.message;

        toast.error(
          Array.isArray(backendMessage)
            ? backendMessage.join(", ")
            : backendMessage ||
                "Request failed"
        );
      } else {
        toast.error(
          "An unexpected error occurred"
        );
      }

      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar
        activeLink="doctors"
        showAuthButtons={true}
      />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <DoctorRegisterHero />

          <section className="lg:col-span-7">
            <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border-0">
              <form
                className="space-y-10"
                onSubmit={handleSubmit(onSubmit)}
              >
                <RegistrationDetailsSection
                  register={register}
                  setValue={setValue}
                  errors={errors}
                />

                <div className="bg-surface-container p-1px" />

                <ClinicalDetails
                  register={register}
                  errors={errors}
                />

                <MedicalLicenseUpload
                  medicalLicense={
                    medicalLicense
                  }
                  medicalLicenseError={
                    medicalLicenseError
                  }
                  handleFileChange={
                    handleFileChange
                  }
                />

                <SubmitSection
                  isLoading={isLoading}
                />
              </form>
            </div>
          </section>
        </div>
      </main>

      <InformationFooter />
    </>
  );
}

export default RegisterDoctor;