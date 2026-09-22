import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Role } from "@prisma/client";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IS_PUBLIC_KEY } from "src/auth/decorator/public.decorator";
import { Reflector } from "@nestjs/core";

export interface JwtPayload {
  sub: string;
  role: Role;
  name: string;
  email: string;
  verified: boolean;
  image?: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
  cookies: {
    access_token: string;
  };
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException("You are not logged in");
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user?.role === Role.BANNED) {
        throw new UnauthorizedException("User not found");
      }

      request.user = {
        sub: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        verified: user.verified,
        image: user.image,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid token");
    }
  }
}
