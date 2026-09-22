// export default function DoctorLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <>{children}</>;
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../layout";
import { toast } from "react-toastify";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "DOCTOR")) {
      toast.error("You must be a doctor to access this page.");
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  if (!user || user.role !== "DOCTOR") {
    return null;
  }

  return <>{children}</>;
}
