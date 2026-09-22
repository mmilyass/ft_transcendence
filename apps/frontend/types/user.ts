export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "DOCTOR" | "USER" | "ADMIN";
  verified: boolean;
  createdAt: string;
  image: string;
}