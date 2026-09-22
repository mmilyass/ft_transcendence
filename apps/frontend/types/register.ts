import { z } from "zod";
import { registerSchema } from "../app/schema/register";
import { User } from "@/app/layout";

export type RegisterFormData = z.infer<typeof registerSchema>;

export interface RegisterProps {
    setUser: (user: User | null) => void;
}