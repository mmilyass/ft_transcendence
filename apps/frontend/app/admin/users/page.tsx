import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminShell from "@/app/admin/components/AdminShell";
import UsersPageHeader from "./components/UsersPageHeader";
import UsersStatsGrid from "./components/UsersStatsGrid";
import UsersTable from "./components/UsersTable";
import UsersPagination from "./components/UsersPagination";
import { getDashboardStats } from "@/lib/admin/dashboard";
import axios from "axios";

import { cookies } from "next/headers";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
  }>;
}) {
  const params = await searchParams;

  const currentPage = Number(params.page || 1);
  const searchQuery = params.search || "";
  const roleQuery = params.role || "";

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axios.get(
    `${process.env.INTERNAL_API_URL}/admin/users?page=${currentPage}&search=${searchQuery}&role=${roleQuery}`,
    {
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
    },
  );

const data = await getDashboardStats();
  const users = response.data.users;

  return (
    <AdminShell activePage="users">
      <AdminHeader />
      <section className="mt-16 p-4 sm:p-8 flex-1">
        <div className="max-w-7xl mx-auto space-y-8">
          <UsersPageHeader search={searchQuery} role={roleQuery} />
          <UsersStatsGrid stats={data.stats} />
          <UsersTable users={users} />
          <UsersPagination
            totalResults={users.length}
            currentPage={currentPage}
            totalPages={response.data.totalPages}
          />
        </div>
      </section>
    </AdminShell>
  );
}