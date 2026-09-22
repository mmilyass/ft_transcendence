"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/layout";

export default function GoogleCallback() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.push("/");
    } else {
      toast.error("Login failed");
      router.push("/register");
    }
  }, [user, loading, router]);

  return <div>Processing login...</div>;
}
