import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminShell from "@/app/admin/components/AdminShell";

import ApplicationsHeader from "./components/ApplicationsHeader";
import ApplicationFilters from "./components/ApplicationFilters";
import ApplicationsTable from "./components/ApplicationsTable";
import ApplicationsPagination from "./components/ApplicationsPagination";
import ApplicationsSummary from "./components/ApplicationsSummary";

import axios from "axios";
import { cookies } from "next/headers";
import { getDoctorApplicationSummary } from "./server";

export interface DoctorApplication {
  speciality: string;
  license_number: string;
  createdAt: string;
}

export interface Application {
  id: string;
  email: string;
  name: string;
  doctor: DoctorApplication;
  status: string;
  image: string;
  role: string;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    role?: string;
  }>;
}) {
  const { page, role } = await searchParams;

  const pageQuery = Number(page) || 1;
  const roleQuery = role || "";

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const applicationsResponse = await axios.get(
    process.env.INTERNAL_API_URL + `/admin/doctor-applications?page=${pageQuery}&role=${roleQuery}`,
    {
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
    }
  );

  const applications: Application[] =
    applicationsResponse.data.applications;

  applications.forEach((app) => {
    app.doctor.createdAt = new Date(
      app.doctor.createdAt
    ).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  });

  const stats = await getDoctorApplicationSummary();

  return (
    <AdminShell activePage="doctors">
      <AdminHeader />
      <main className="mt-16 p-4 sm:p-8 min-h-screen bg-surface">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <ApplicationsHeader />
          <ApplicationFilters role={roleQuery} />
        </div>
        <ApplicationsTable applications={applications} />
        <ApplicationsPagination
          total={applicationsResponse.data.total}
          page={pageQuery}
          totalPages={applicationsResponse.data.totalPages}
        />
        <ApplicationsSummary stats={stats} />
      </main>
    </AdminShell>
  );
}