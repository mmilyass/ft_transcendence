import axios from "axios";
import { toast } from "react-toastify";


export async function approveUser(userId: string) {
  try {
    await axios.patch(
      process.env.NEXT_PUBLIC_URL + `/admin/users/${userId}/activate`,
      {},
      { withCredentials: true }
    );

    toast.success("User approved successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to approve user");
  }
}

export async function disableUser(userId: string) {
  try {
    await axios.patch(
      process.env.NEXT_PUBLIC_URL + `/admin/users/${userId}/disable`,
      {},
      {
        withCredentials: true,
      }
    );

    toast.success("User disabled successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to disable user");
  }
}
export async function deleteUser(userId: string) {
  try {
    await axios.delete(
      process.env.NEXT_PUBLIC_URL + `/admin/users/${userId}`,
      { withCredentials: true }
    );

    toast.success("User deleted successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete user");
  }
}

export async function banUser(userId: string) {
  try {
    await axios.patch(
      process.env.NEXT_PUBLIC_URL + `/admin/users/${userId}/ban`,
      {},
      { withCredentials: true }
    );

    toast.success("User banned successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to ban user");
  }
}