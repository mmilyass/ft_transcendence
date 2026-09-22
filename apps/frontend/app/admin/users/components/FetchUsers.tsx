import axios from "axios";

export default async function FetchUsers() {
    const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/admin/users", { withCredentials: true });
    return response.data.users;
}