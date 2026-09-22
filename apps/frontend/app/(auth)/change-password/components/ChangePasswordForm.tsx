"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PasswordField from "./PasswordField";
import ShowPasswordToggle from "./ShowPasswordToggle";

import {
  changeSchema,
  ChangeForm,
} from "@/lib/validations/changePasswordSchema";

export default function ChangePasswordForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeForm>({
    resolver: zodResolver(changeSchema),
  });

  const onSubmit = async (data: ChangeForm) => {
    setLoading(true);

    try {
      await axios.patch(
        process.env.NEXT_PUBLIC_URL + "/auth/change-password",
        {
          old_password: data.currentPassword,
          new_password: data.newPassword,
          new_password_confirmation: data.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Password changed successfully");

      router.push("/");
    } catch (err: unknown) {
      console.error(err);

      const backendMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : undefined;
      const message = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage ||
          (err instanceof Error ? err.message : "An unknown error occurred.");

      toast.error(`${message} Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <PasswordField
          id="currentPassword"
          label="Current Password"
          placeholder="••••••••"
          showPassword={showPassword}
          register={register("currentPassword")}
          error={errors.currentPassword}
        />

        <PasswordField
          id="newPassword"
          label="New Password"
          placeholder="••••••••"
          showPassword={showPassword}
          register={register("newPassword")}
          error={errors.newPassword}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm New Password"
          placeholder="••••••••"
          showPassword={showPassword}
          register={register("confirmPassword")}
          error={errors.confirmPassword}
        />

        <ShowPasswordToggle
          checked={showPassword}
          onChange={setShowPassword}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 font-bold rounded-xl transition-all duration-200 active:scale-[0.98]"
          style={{
            backgroundColor: "#0057cd",
            color: "#ffffff",
            boxShadow: "0 8px 16px rgba(0, 87, 205, 0.2)",
            opacity: loading ? 0.5 : 1,
            borderRadius: "24px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 12px 24px rgba(0, 87, 205, 0.3)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 8px 16px rgba(0, 87, 205, 0.2)")
          }
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p
          className="text-sm font-medium"
          style={{ color: "#424655" }}
        >
          <span
            onClick={() => router.back()}
            className="font-bold hover:underline underline-offset-4 cursor-pointer"
            style={{
              color: "#0057cd",
              textDecorationColor:
                "rgba(0, 87, 205, 0.3)",
            }}
          >
            Back
          </span>
        </p>
      </div>
    </>
  );
}