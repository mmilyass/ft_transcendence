'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../layout";
import { toast } from "react-toastify";

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("You must be logged in to access this page.");
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}