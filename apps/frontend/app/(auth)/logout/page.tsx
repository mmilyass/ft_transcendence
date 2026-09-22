'use client';
import { useAuth } from "@/app/layout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export  async function LogoutPage() {
    try {
      await axios.post(process.env.NEXT_PUBLIC_URL + "/auth/logout", {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
}

export default function Logout() {
  const router = useRouter();
  const { user,loading, setUser } = useAuth();
  useEffect(() => {
    const LogoutFunction = async () => {
      await LogoutPage();
      }
    LogoutFunction();
    setUser(null);
    router.push('/login');
  }, [router, setUser]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  if (!user) {
    return <div className="flex items-center justify-center h-screen">You are not logged in.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Logout</h1>
      <p>You have been logged out.</p>
    </div>
  );
}
