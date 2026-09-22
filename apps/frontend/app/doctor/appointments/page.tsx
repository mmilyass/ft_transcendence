"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DoctorShell from "../components/DoctorShell";
import AppointmentsHeader from "./components/AppointmentsHeader";
import AppointmentsFilters from "./components/AppointmentsFilters";
import AppointmentsTable from "./components/AppointmentsTable";
import EmptyState from "./components/EmptyState";
import { useAuth } from "@/app/layout";
import {
  cancelDoctorBookingApi,
  completeDoctorBookingApi,
  fetchDoctorBookingsApi,
  type DoctorBooking,
} from "@/lib/api";

export type AppointmentStatus = "BOOKED" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  id: string;
  patientName: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

export const STATUS_COLORS = {
  BOOKED: {
    bg: "bg-tertiary-container/20",
    text: "text-tertiary",
  },
  COMPLETED: {
    bg: "bg-green-500/10",
    text: "text-green-600",
  },
  CANCELLED: {
    bg: "bg-error-container/20",
    text: "text-error",
  },
} as const;

function formatDate(dateValue: string) {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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

function toAppointment(booking: DoctorBooking): Appointment {
  return {
    id: booking.id,
    patientName: booking.user?.name || "Unknown patient",
    service: booking.service?.name || "Service",
    date: formatDate(booking.date),
    time: `${formatTime(booking.start_time)} — ${formatTime(booking.end_time)}`,
    status: booking.status,
  };
}

export default function Appointments() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDoctorBookingsApi();
        setAppointments(data.map(toAppointment));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch appointments",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadAppointments();
  }, [authLoading, router, user]);

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((appointment) =>
        [appointment.patientName, appointment.service, appointment.id]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    [appointments, searchTerm],
  );

  const bookedCount = appointments.filter(
    (item) => item.status === "BOOKED",
  ).length;
  const completedCount = appointments.filter(
    (item) => item.status === "COMPLETED",
  ).length;

  const handleComplete = async (appointmentId: string) => {
    try {
      setActionId(appointmentId);
      await completeDoctorBookingApi(appointmentId);
      setAppointments((current) =>
        current.map((item) =>
          item.id === appointmentId ? { ...item, status: "COMPLETED" } : item,
        ),
      );
      toast.success("Appointment marked as completed");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to complete appointment",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      setActionId(appointmentId);
      await cancelDoctorBookingApi(appointmentId);
      setAppointments((current) =>
        current.map((item) =>
          item.id === appointmentId ? { ...item, status: "CANCELLED" } : item,
        ),
      );
      toast.success("Appointment cancelled and slot returned to availability");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel appointment",
      );
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <DoctorShell>
        <main className="flex-1 bg-surface min-h-screen overflow-y-auto flex items-center justify-center">
          <p className="text-on-surface-variant">Loading appointments...</p>
        </main>
      </DoctorShell>
    );
  }

  return (
    <DoctorShell>
      <main className="flex-1 bg-surface min-h-screen overflow-y-auto">
        <AppointmentsHeader
          bookedCount={bookedCount}
          completedCount={completedCount}
        />
        <section className="px-4 sm:px-8 pb-12">
          <AppointmentsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          {error && (
            <div className="mb-4 p-4 bg-error/10 text-error rounded-lg border border-error/20">
              {error}
            </div>
          )}
          {filteredAppointments.length === 0 ? (
            <EmptyState />
          ) : (
            <AppointmentsTable
              appointments={filteredAppointments}
              onComplete={handleComplete}
              onCancel={handleCancel}
              actionId={actionId}
            />
          )}
        </section>
      </main>
    </DoctorShell>
  );
}
