import axios from "axios";

export async function approveDoctor(id: string) {
  return axios.patch(
    process.env.NEXT_PUBLIC_URL + `/admin/doctor/${id}/approve`,
    {},
    { withCredentials: true }
  );
}

export async function rejectDoctor(id: string) {
  return axios.patch(
    process.env.NEXT_PUBLIC_URL + `/admin/doctor/${id}/reject`,
    {},
    { withCredentials: true }
  );
}

export async function activateDoctor(id: string) {
  return axios.patch(
    process.env.NEXT_PUBLIC_URL + `/admin/doctor/${id}/activate`,
    {},
    { withCredentials: true }
  );
}

export async function suspendDoctor(id: string) {
  return axios.patch(
    process.env.NEXT_PUBLIC_URL + `/admin/doctor/${id}/suspend`,
    {},
    { withCredentials: true }
  );
}
