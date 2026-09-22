import { SetMetadata } from "@nestjs/common";
import { Role } from "@prisma/client";

export const ROLES_KEY = "roles" as const;
// Roles metadata is read by RolesGuard to compare against request.user.role
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
