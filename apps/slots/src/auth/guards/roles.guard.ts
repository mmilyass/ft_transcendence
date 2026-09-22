import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "@prisma/client";
import { ROLES_KEY } from "src/auth/decorator/roles.decorator";

interface RolesGuardUser {
  sub: string;
  email: string;
  role: Role;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: RolesGuardUser;
    }>();

    // request.user is populated by JwtGuard/JwtStrategy validate() payload
    const user = request.user;
    if (!user?.role) {
      return false;
    }

    const userRole = String(user.role).toUpperCase() as Role;
    return requiredRoles.includes(userRole);
  }
}
