"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import AppointmentsHeader from "./components/AppointmentsHeader";
import AppointmentsFilters from "./components/AppointmentsFilters";
import AppointmentCard from "./components/AppointmentCard";
import AppointmentsLoading from "./components/AppointmentsLoading";
import AppointmentsEmpty from "./components/AppointmentsEmpty";
import ReviewModal from "./components/ReviewModal";
import { useAuth } from "@/app/layout";
import {
  cancelMyBookingApi,
  fetchMyBookingsApi,
  fetchMyReviewsApi,
  type DoctorReview,
  type UserBooking,
} from "@/lib/api";

const STATUS_FILTERS = ["ALL", "BOOKED", "COMPLETED", "CANCELLED"] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function AppointmentsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [reviewingBooking, setReviewingBooking] = useState<UserBooking | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [bookingsData, reviewsData] = await Promise.all([
          fetchMyBookingsApi(),
          // A patient's own reviews aren't essential to seeing their
          // appointments — don't let this call failing block the whole
          // page, just fall back to "no reviews known yet".
          fetchMyReviewsApi().catch(() => []),
        ]);
        setBookings(bookingsData);
        setReviews(reviewsData);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [authLoading, router, user]);

  const visibleBookings = useMemo(() => {
    if (filter === "ALL") return bookings;
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  // One review per doctor, so a completed appointment's "leave a review"
  // button reflects whether this patient has already reviewed *that
  // doctor* at all, not this specific appointment.
  const reviewsByDoctor = useMemo(() => {
    const map = new Map<string, DoctorReview>();
    for (const review of reviews) {
      map.set(review.doctorId, review);
    }
    return map;
  }, [reviews]);

  const upcomingCount = bookings.filter((b) => b.status === "BOOKED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;

  const handleCancel = async (booking: UserBooking) => {
    try {
      setCancelingId(booking.id);
      await cancelMyBookingApi(booking.id);
      setBookings((current) =>
        current.map((item) =>
          item.id === booking.id ? { ...item, status: "CANCELLED" } : item
        )
      );
      toast.success("Appointment successfully cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setCancelingId(null);
    }
  };

  const handleReviewSaved = (review: DoctorReview) => {
    setReviews((current) => {
      const withoutThisDoctor = current.filter((r) => r.doctorId !== review.doctorId);
      return [...withoutThisDoctor, review];
    });
  };

  return (
    <div className="min-h-screen bg-slate-900/2 text-slate-900 selection:bg-primary/20 selection:text-primary">
      <Navbar activeLink="" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-20 space-y-8">


            <AppointmentsHeader
        upcomingCount={upcomingCount}
        completedCount={completedCount}
        cancelledCount={cancelledCount}
        />

      <AppointmentsFilters
        filter={filter}
        onChange={setFilter}
      />

      {loading ? (
        <AppointmentsLoading />
      ) : visibleBookings.length === 0 ? (
        <AppointmentsEmpty />
      ) : (
        <div className="grid gap-4">
          {visibleBookings.map((booking) => (
            <AppointmentCard
            key={booking.id}
            booking={booking}
            cancelingId={cancelingId}
            onCancel={handleCancel}
            existingReview={
              booking.doctor?.id ? reviewsByDoctor.get(booking.doctor.id) : undefined
            }
            onReview={setReviewingBooking}
            />
          ))}
        </div>
      )}
      </main>

      {reviewingBooking && reviewingBooking.doctor?.id && (
        <ReviewModal
          doctorId={reviewingBooking.doctor.id}
          doctorName={reviewingBooking.doctor.user?.name || "your doctor"}
          existingReview={reviewsByDoctor.get(reviewingBooking.doctor.id) ?? null}
          onClose={() => setReviewingBooking(null)}
          onSaved={handleReviewSaved}
        />
      )}
    </div>
  );
}
