'use client';

import ForgotPasswordHeader from "./components/ForgotPasswordHeader";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

export default function ForgotPassword() {
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
          <ForgotPasswordHeader />
          <ForgotPasswordForm />
        </div>
      </main>
    </div>
  );
}