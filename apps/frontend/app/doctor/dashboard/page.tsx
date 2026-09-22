"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DoctorShell from "../components/DoctorShell";
import InformationFooter from "@/components/InformationFooter";
import DoctorHeader from "./components/DoctorHeader";
import StatsCards from "./components/StatsCards";
import AppointmentChart from "./components/AppointmentChart";
import TodaySchedule from "./components/TodaySchedule";
import { useAuth } from "@/app/layout";
import { fetchDoctorBookingsApi, DoctorBooking } from "@/lib/api";

type Stats = {
  totalAppointments: number;
  upcomingToday: number;
  weeklyGrowth: number;
};

type ScheduleItem = {
  id: string;
  patientName: string;
  type: string;
  time: string;
  avatar: string | null;
  border?: string;
};

function toLocalDateStr(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatTime(timeValue: string) {
  const [hours, minutes] = timeValue.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const Dashboard = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setName(user.name ?? "Doctor");
    fetchDashboardData();
  }, [authLoading, router, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const bookings: DoctorBooking[] = await fetchDoctorBookingsApi();
      const now = new Date();
      const todayStr = toLocalDateStr(now);

      const todayBookings = bookings.filter(
        (b) => b.status === "BOOKED" && toLocalDateStr(new Date(b.date)) === todayStr,
      );

      // Simple week-over-week comparison of appointment volume (any status),
      // using the booking's own date field — no dedicated analytics
      // endpoint exists yet, so this is computed client-side from the same
      // list the appointments page already fetches.
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(now.getDate() - 14);

      const thisWeekCount = bookings.filter((b) => {
        const d = new Date(b.date);
        return d >= weekAgo && d <= now;
      }).length;
      const lastWeekCount = bookings.filter((b) => {
        const d = new Date(b.date);
        return d >= twoWeeksAgo && d < weekAgo;
      }).length;

      const weeklyGrowth =
        lastWeekCount === 0
          ? thisWeekCount > 0
            ? 100
            : 0
          : Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);

      setStats({
        totalAppointments: bookings.length,
        upcomingToday: todayBookings.length,
        weeklyGrowth,
      });

      setTodaySchedule(
        [...todayBookings]
          .sort((a, b) => a.start_time.localeCompare(b.start_time))
          .map((b) => ({
            id: b.id,
            patientName: b.user?.name || "Unknown patient",
            type: b.service?.name || "Appointment",
            time: formatTime(b.start_time),
            avatar: null,
          })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorShell>
      <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto bg-surface">
        <DoctorHeader name={name || "Doctor"} />
        {error && (
          <div className="p-4 bg-error/10 text-error rounded-lg border border-error/20">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-on-surface-variant">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <AppointmentChart />
              <TodaySchedule scheduleItems={todaySchedule} />
            </section>
          </>
        )}
      </main>
      <InformationFooter />
    </DoctorShell>
  );
};

export default Dashboard;
