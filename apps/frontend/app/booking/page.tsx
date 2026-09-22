import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import { DoctorDetailResponse, Service } from "@/types";
import Navbar from "@/components/Navbar";
import InformationFooter from "@/components/InformationFooter";
import DoctorHero from "./components/DoctorHero";
import DoctorAbout from "./components/DoctorAbout";
import DoctorServices from "./components/DoctorServices";
import DoctorLocations from "./components/DoctorLocations";
import BookingSidebar from "./components/BookingSidebar";
import ReviewsTeaser from "./components/ReviewsTeaser";
import DoctorReviews from "./components/DoctorReviews";

// Real Server Component: the doctor profile + services + reviews are fetched
// on the server (both `/doctor/:id` and `/services/:doctorId` are @Public()
// on their respective services) and rendered straight into the HTML — no
// client-side loading spinner for the main content anymore. Only the
// booking widget itself (date/time picking, submit) stays a Client
// Component, since that's genuinely interactive.
//
// Login is still required to view this page (matches the previous
// behavior), but the check now happens server-side via `redirect()` instead
// of a client `useEffect`, so an anonymous visitor never sees the page flash
// before being sent to /login.
export default async function Booking({
  searchParams,
}: {
  searchParams: Promise<{ doctorId?: string }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const params = await searchParams;
  const doctorId = params.doctorId || "";

  let doctorData: DoctorDetailResponse | null = null;

  try {
    const [doctorRes, servicesRes] = await Promise.all([
      axios.get(`${process.env.INTERNAL_API_URL}/doctor/${doctorId}`),
      axios
        .get(`${process.env.INTERNAL_API_URL}/services/${doctorId}`)
        .catch(() => ({ data: [] })),
    ]);

    const doctor = doctorRes.data;

    // The doctor record itself has no `services` field (services live in the
    // slots service's own Service model) — the old client-side version read
    // `doctor.services` here, which was always undefined, so the "Services &
    // Procedures" section silently rendered empty for every single doctor.
    const services: Service[] = (servicesRes.data ?? []).map((s: any) => ({
      id: s.id,
      name: s.name,
      description: s.description ?? "",
      price: s.price,
      icon: s.icon ?? "medical_services",
      insuranceAccepted: s.insuranceAccepted ?? false,
    }));

    doctorData = {
      doctor,
      location: doctor.location,
      services,
      publications: doctor.publications ?? 0,
      reviews: doctor.reviews ?? [],
      availability: [],
    };
  } catch (error) {
    console.error("Error loading doctor details:", error);
  }

  if (!doctorData) {
    return (
      <>
        <Navbar activeLink="doctors" />
        <main className="pt-32 pb-20 max-w-screen-2xl mx-auto px-6 text-center text-on-surface-variant">
          Error loading doctor data
        </main>
        <InformationFooter />
      </>
    );
  }

  const { doctor, services, publications, reviews } = doctorData;

  return (
    <>
      <Navbar activeLink="doctors" />

      <main className="pt-24 pb-20 max-w-screen-2xl mx-auto px-6">
        <DoctorHero doctor={doctor} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <DoctorAbout doctor={doctor} publications={publications} />

            <DoctorServices services={services} />

            <DoctorLocations locations={doctor.location} />

            <DoctorReviews
              reviews={reviews}
              rating={doctor.rating}
              reviewCount={doctor.reviewCount}
            />
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <BookingSidebar doctorId={doctorId} doctorName={doctor.user.name} />
              <ReviewsTeaser reviews={reviews} rating={doctor.rating} />
            </div>
          </aside>
        </div>
      </main>

      <InformationFooter />
    </>
  );
}
