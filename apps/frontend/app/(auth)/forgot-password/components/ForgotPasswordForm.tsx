"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  forgotSchema,
  ForgotForm,
} from "@/lib/validations/forgotPasswordSchema";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_URL + "/auth/forgot-password",
        { email: data.email },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const message =
        response.data?.message ||
        "Password reset email sent successfully";

      toast.success(message);

      router.push("/login");
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
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider"
            style={{ color: "#191c1e" }}
          >
            Email Address
          </label>

          <input
            id="email"
            placeholder="your@email.com"
            {...register("email")}
            className="w-full px-4 py-4 border-none rounded-xl outline-none font-medium"
            style={{
              backgroundColor: "#f3f3f7",
              color: "#191c1e",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 2px rgba(0,87,205,0.2)";
              e.currentTarget.style.backgroundColor =
                "#ffffff";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.backgroundColor =
                "#f3f3f7";
            }}
          />

          {errors.email && (
            <p
              className="text-xs"
              style={{ color: "#dc2626" }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 font-bold rounded-xl transition-all duration-200 active:scale-[0.98]"
          style={{
            backgroundColor: "#0057cd",
            color: "#ffffff",
            boxShadow:
              "0 8px 16px rgba(0, 87, 205, 0.2)",
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
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p
          className="text-sm font-medium"
          style={{ color: "#424655" }}
        >
          <span
            onClick={() => router.push("/login")}
            className="font-bold hover:underline underline-offset-4 cursor-pointer"
            style={{
              color: "#0057cd",
              textDecorationColor:
                "rgba(0, 87, 205, 0.3)",
            }}
          >
            Back to Login
          </span>
        </p>
      </div>
    </>
  );
}