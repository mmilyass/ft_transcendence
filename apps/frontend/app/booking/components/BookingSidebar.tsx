"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/layout";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { fetchServices, apiFetch, bookServiceSlotApi } from "@/lib/api";

type Props = {
  doctorId: string;
  doctorName?: string;
};

type ServiceItem = {
  id: string;
  name: string;
  price: number;
  duration: number; // e.g., 60 mins
};

type TimeWindow = {
  start_time: string; // "08:00"
  end_time: string; // "09:00"
  slot_id: string; // Parent shift block id
};

// Format UTC/Date helpers safely
function formatDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function toLocalDateStr(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function BookingSidebar({ doctorId, doctorName }: Props) {
  const router = useRouter();
  const auth = useAuth() as { user: { id?: string } | null; loading: boolean };

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    toLocalDateStr(new Date()),
  );

  const [windows, setWindows] = useState<TimeWindow[]>([]);
  const [selectedWindow, setSelectedWindow] = useState<TimeWindow | null>(null);

  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingWindows, setLoadingWindows] = useState(false);
  const [booking, setBooking] = useState(false);

  // 1. Fetch available services for this doctor on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingServices(true);
        const data = await fetchServices(doctorId);
        const list = Array.isArray(data) ? data : data?.services || [];
        setServices(list);
        if (list.length > 0) {
          setSelectedServiceId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingServices(false);
      }
    }
    if (doctorId) loadData();
  }, [doctorId]);

  // 2. Fetch sliced time windows when service or date changes
  useEffect(() => {
    async function fetchWindows() {
      if (!selectedServiceId || !selectedDate) {
        setWindows([]);
        return;
      }

      try {
        setLoadingWindows(true);
        setSelectedWindow(null); // Reset choice on change

        const res = await apiFetch(
          `/slots/available?doctorId=${doctorId}&serviceId=${selectedServiceId}&date=${selectedDate}`,
        );

        if (!res.ok) throw new Error("Failed to check availability");
        const data = await res.json();

        setWindows(data.windows || []);
      } catch (err) {
        console.error(err);
        setWindows([]);
      } finally {
        setLoadingWindows(false);
      }
    }

    fetchWindows();
  }, [doctorId, selectedServiceId, selectedDate]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId),
    [services, selectedServiceId],
  );

  const refetchWindows = useCallback(async () => {
    if (!selectedServiceId || !selectedDate) {
      setWindows([]);
      return;
    }
    try {
      setLoadingWindows(true);
      const res = await apiFetch(
        `/slots/available?doctorId=${doctorId}&serviceId=${selectedServiceId}&date=${selectedDate}`,
      );
      if (!res.ok) throw new Error("Failed to check availability");
      const data = await res.json();
      const freshWindows: TimeWindow[] = data.windows || [];
      setWindows(freshWindows);

      // If the user's current pick fell out of the fresh list, clear it
      setSelectedWindow((prev) =>
        prev && !freshWindows.some((w) => w.start_time === prev.start_time)
          ? null
          : prev,
      );
    } catch (err) {
      console.error(err);
      setWindows([]);
    } finally {
      setLoadingWindows(false);
    }
  }, [doctorId, selectedServiceId, selectedDate]);

  useEffect(() => {
    refetchWindows();
  }, [refetchWindows]);

  // Keep availability honest while the user is deciding
  useEffect(() => {
    const interval = setInterval(refetchWindows, 60_000); // every 60s
    return () => clearInterval(interval);
  }, [refetchWindows]);

  const handleBook = async () => {
    if (!auth?.user) {
      toast.error("Please log in to book an appointment");
      router.push("/login");
      return;
    }

    if (!selectedService || !selectedWindow) {
      toast.warning("Please select a service and an available time window");
      return;
    }

    try {
      setBooking(true);

      await bookServiceSlotApi({
        doctorId,
        serviceId: selectedService.id,
        date: selectedDate,
        start_time: selectedWindow.start_time,
      });

      toast.success("Appointment booked successfully!");
      router.push("/appointments");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Booking failed");
      setSelectedWindow(null);
      await refetchWindows(); // ← pull fresh availability so the dead slot is gone
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 shadow-xl shadow-surface-container/5 space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-on-surface tracking-tight">
          Book Appointment
        </h3>
        <p className="text-xs text-on-surface-variant mt-1">
          {doctorName ? `With Dr. ${doctorName}` : "Select service and time"}
        </p>
      </div>

      {/* Service Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Select Service
        </label>
        {loadingServices ? (
          <div className="text-xs text-outline py-2">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-xs text-error py-2">No services available</div>
        ) : (
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.duration} min) — ${s.price}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          Date
        </label>
        <input
          type="date"
          value={selectedDate}
          min={toLocalDateStr(new Date())}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Dynamic Sliced Time Windows */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Available Slots ({formatDateLabel(selectedDate)})
          </label>
          {selectedService && (
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {selectedService.duration} min duration
            </span>
          )}
        </div>

        {loadingWindows ? (
          <div className="text-center py-6 text-xs text-on-surface-variant">
            Calculating available times...
          </div>
        ) : windows.length === 0 ? (
          <div className="bg-surface-container-low rounded-2xl p-4 text-center space-y-2 border border-outline-variant/10">
            <span className="material-symbols-outlined text-outline text-2xl">
              event_busy
            </span>
            <p className="text-xs font-medium text-on-surface-variant">
              No available time for this service on this day.
            </p>
            <p className="text-[11px] text-primary font-semibold">
              Please choose another day or service.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {windows.map((w, index) => {
              const isSelected = selectedWindow?.start_time === w.start_time;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedWindow(w)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? "bg-primary text-on-primary border-primary shadow-sm"
                      : "bg-surface-container-low border-outline-variant/30 text-on-surface hover:border-primary/50"
                  }`}
                >
                  <span>{formatTime(w.start_time)}</span>
                  <span className="text-[10px] opacity-80">
                    to {formatTime(w.end_time)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl bg-surface-container-low p-4 space-y-2 border border-outline-variant/10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Service</span>
          <span className="font-semibold text-on-surface truncate max-w-40">
            {selectedService?.name || "None"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Time Slot</span>
          <span className="font-semibold text-on-surface">
            {selectedWindow
              ? `${formatTime(selectedWindow.start_time)} - ${formatTime(selectedWindow.end_time)}`
              : "None selected"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs pt-2 border-t border-outline-variant/20">
          <span className="text-on-surface-variant font-bold">Total Price</span>
          <span className="font-black text-primary text-sm">
            {selectedService ? `$${selectedService.price}` : "$0"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleBook}
        disabled={booking || !selectedServiceId || !selectedWindow}
        className="w-full bg-primary text-on-primary py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {booking ? "Booking..." : "Confirm & Book Appointment"}
      </button>

      <p className="text-[10px] text-center text-outline leading-tight">
        Your slot will be reserved instantly out of the doctor&apos;s active
        shift block.
      </p>
    </div>
  );
}
