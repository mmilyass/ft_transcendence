import axios from "axios";
import { cookies } from "next/headers";

export async function getDashboardStats() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axios.get(
    process.env.INTERNAL_API_URL + "/admin/dashboard",
    {
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
    }
  );

  return response.data;
}