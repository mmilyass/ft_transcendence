"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ResetPasswordHeader from "./components/ResetPasswordHeader";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { resetSchema } from "@/app/schema/reset-password";

export type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = async (data: ResetForm) => {
    if (!token) {
      const message =
        "Reset token is missing. Please request a new password reset link.";

      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(
        process.env.NEXT_PUBLIC_URL + `/auth/reset-password/token=${token}`,
        {
          new_password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const message =
        response.data?.message ||
        "Password has been reset successfully";

      toast.success(message);

      router.refresh();
      router.push("/");
    } catch (err) {
      console.error(err);

      const backendMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : undefined;
      const message = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage ||
          (err instanceof Error ? err.message : "An unknown error occurred.");

      toast.error(message + " Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="font-body min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: "#f9f9fd",
        color: "#191c1e",
      }}
    >
      <main className="w-full max-w-120">
        <ResetPasswordHeader />

        <div className="glass-panel rounded-xl shadow-[0_12px_40px_rgba(0,87,206,0.06)] p-8 md:p-12">
          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <ResetPasswordForm
              register={register}
              errors={errors}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
            />
          </form>
        </div>
      </main>
    </div>
  );
}