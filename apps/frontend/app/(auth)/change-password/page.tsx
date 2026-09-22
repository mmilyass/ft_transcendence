"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/layout";

import ChangePasswordHeader from "./components/ChangePasswordHeader";
import ChangePasswordForm from "./components/ChangePasswordForm";
import BackButton from "@/components/BackButton";

export default function ChangePassword() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
     <div
          className="font-body min-h-screen flex items-center justify-center p-6"
          style={{
            backgroundColor: "#f9f9fd",
            color: "#191c1e",
          }}
          >
          <main className="w-full max-w-120">
            <div className="glass-panel rounded-xl shadow-[0_12px_40px_rgba(0,87,206,0.06)] p-8 md:p-12">
              <ChangePasswordHeader />
              <ChangePasswordForm />
            </div>
          </main>
        </div>
  );
}