"use client";
// import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useState, useEffect, createContext, useContext} from "react";
import axios from "axios";
import { I18nProvider } from "@/lib/i18n/I18nContext";

export type User = {
  sub: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

export interface AuthUser {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthUser>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_URL + "/auth/me", {
        headers: {
          "Cache-Control": "no-cache",
        },
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Service worker registration failed:", err);
      });
    }
  }, []);

  return (
    <html lang="en" className="light">
      <head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="MAOU3IDY-LOGO" href="/MAOU3IDY.png" />
        <link rel="icon" href="/icon-192.png" />
        <meta name="theme-color" content="#0f172a" />
        {/* Fonts */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
        {/* Icons */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
          }
        `}</style>
      </head>
      <body>
        <I18nProvider>
          <AuthProvider>
          {children}
          </AuthProvider>
        </I18nProvider>
        <ToastContainer
        position="top-right"
        autoClose={5000}
        closeOnClick
        />
      </body>
    </html>
  );
}
