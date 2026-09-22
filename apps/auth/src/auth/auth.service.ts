import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { ForgetPasswordDto } from "./dto/forget_password.dto";
import { Role, User } from "@prisma/client";
import { DoctorRegisterDto } from "./dto/DoctorRegister.dto";
import { DoctorService } from "src/doctor/doctor.service";
import { JwtPayload } from "./guards/jwt.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { RabbitMqService } from "src/rabbitmq/rabbitmq.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { GoogleProfile } from "./strategies/google.strategy";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private UserService: UsersService,
    private readonly doctorService: DoctorService,
    private readonly prisma: PrismaService,
    private readonly rabbitMqService: RabbitMqService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private get frontendBaseUrl() {
    return process.env.FRONTEND_URL ?? "http://localhost:3000";
  }

  private emitEvent(pattern: string, data: unknown) {
    this.rabbitMqService.emit(pattern, data).subscribe();
  }

  private signToken(payload: JwtPayload, expiresIn: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.jwtService.sign(payload, { expiresIn } as any);
  }

  private ensurePasswordStrength(password: string) {
    if (password.length < 8) {
      throw new BadRequestException("Password must be at least 8 characters");
    }
  }
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
  async compare(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed);
  }
  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }
  async register(body: RegisterDto) {
    this.ensurePasswordStrength(body.password);
    const email = this.normalizeEmail(body.email);
    const hashedPassword = await this.hashPassword(body.password);
    if (await this.UserService.findByEmail(email)) {
      throw new BadRequestException("Email already exists");
    }
    const [user, token] = await this.prisma.$transaction(async (tx) => {
      const updateUser = await this.UserService.create({
        ...body,
        email,
        password: hashedPassword,
      });

      const payload: JwtPayload = {
        sub: String(updateUser.id),
        name: updateUser.name,
        email: updateUser.email,
        role: Role.USER,
        verified: updateUser.verified,
      };
      const token = this.signToken(payload, "1d");
      await tx.auditlog.create({
        data: {
          user_id: updateUser.id,
          action: "User registered with email: " + updateUser.email,
        },
      });

      const stats = await tx.stats.findFirst();
      if (!stats) {
        await tx.stats.create({
          data: {
            TotalUsers: 1,
          },
        });
      } else {
        await tx.stats.update({
          where: { id: stats.id },
          data: {
            TotalUsers: {
              increment: 1,
            },
          },
        });
      }
      await tx.notification.create({
        data: {
          user_id: updateUser.id,
          message: `Welcome ${updateUser.name}! Thank you for registering. Please verify your email to access all features.`,
          title: "Welcome to Our Platform!",
          isRead: false,
        },
      });
      return [updateUser, token];
    });

    this.emitEvent("user.created", {
      id: user.id,
      email: user.email,
      name: user.name,
      token: token,
      role: String(Role.USER),
      verified: user.verified,
    });
    return {
      statusCode: 201,
      message: "User registered successfully",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        verified: user.verified,
        role: String( Role.USER),
      },
    };
  }
  async login(Body: LoginDto) {
    const email = this.normalizeEmail(Body.email);
    const user = await this.UserService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const isMatched = await this.compare(Body.password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException("Wrong password");
    }
    const payload: JwtPayload = {
      sub: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
    };
    const token = this.signToken(payload, "1d");

    const stats = await this.prisma.stats.findFirst();
    if (!stats) {
      await this.prisma.stats.create({
        data: {
          activeSessions: 1,
        },
      });
    } else {
      await this.prisma.stats.update({
        where: { id: stats.id },
        data: {
          activeSessions: {
            increment: 1,
          },
        },
      });
    }

    return {
      statusCode: 200,
      Message: "Login success",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: String(user.role),
        verified: user.verified,
      },
      token: token,
    };
  }
  async forget_password(ForgetPasswordDto: ForgetPasswordDto) {
    const email = this.normalizeEmail(ForgetPasswordDto.email);
    const user = await this.UserService.findByEmail(email);
    if (!user) {
      return {
        statusCode: 200,
        message:
          "If an account exists, a reset link has been sent to your email",
      };
    }
    const payload: JwtPayload = {
      sub: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
    };
    const token = this.signToken(payload, "1d");
    this.emitEvent("user.forget_password", {
      id: user.id,
      email: user.email,
      name: user.name,
      token: token,
    });
    return {
      statusCode: 200,
      message: "If an account exists, a reset link has been sent to your email",
    };
  }
  async reset_password(token: string, new_password: string) {
    this.ensurePasswordStrength(new_password);
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);
      const user = await this.UserService.findByEmail(decoded.email);
      if (!user) {
        throw new BadRequestException("User not found");
      }
      const hashedPassword = await this.hashPassword(new_password);
      await this.prisma.$transaction(async () => {
        await this.UserService.update(user.id, {
          password: hashedPassword,
        });
        await this.verify_email(token);
      });
      return {
        statusCode: 200,
        message: "Password reset successful",
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: String(user.role),
          verified: user.verified,
        },
      };
    } catch (error) {
      console.error("Error resetting password:", error);
      throw new ForbiddenException("Invalid or expired token");
    }
  }
  async verify_email(token: string) {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);

      const user = await this.UserService.findByEmail(decoded.email);

      if (!user) {
        throw new BadRequestException("User not found");
      }

      const [updatedUser, Token] = await this.prisma.$transaction(
        async (tx) => {
          const userReturn = await this.UserService.update(user.id, {
            verified: true,
          });

          const payload: JwtPayload = {
            sub: userReturn.id,
            name: userReturn.name,
            email: userReturn.email,
            role: userReturn.role,
            verified: true,
          };

          const newToken = this.signToken(payload, "1d");

          await tx.auditlog.create({
            data: {
              user_id: user.id,
              action: "User verified their email: " + user.email,
            },
          });

          await tx.notification.create({
            data: {
              user_id: user.id,
              message: `Your email has been verified successfully.`,
              title: "Email Verified",
              isRead: false,
            },
          });
          return [userReturn, newToken];
        },
      );

      return {
        statusCode: 200,
        message: "Email verified successfully",
        token: Token,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          image: updatedUser.image,
          verified: true,
        },
      };
    } catch (error) {
      console.error("Error verifying email:", error);
      throw new ForbiddenException("Invalid or expired token");
    }
  }
  async change_password(
    userId: string,
    old_password: string,
    new_password: string,
  ) {
    this.ensurePasswordStrength(new_password);
    const user = await this.UserService.findById(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    const isMatched = await this.compare(old_password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException("Wrong password");
    }
    const hashedPassword = await this.hashPassword(new_password);
    await this.prisma.$transaction(async (tx) => {
      await this.UserService.update(user.id, { password: hashedPassword });
      await tx.auditlog.create({
        data: {
          user_id: user.id,
          action: "User changed their password",
        },
      });
      await tx.notification.create({
        data: {
          user_id: user.id,
          message: `Your password has been changed successfully.`,
          title: "Password Changed",
          isRead: false,
        },
      });
    });
    return {
      statusCode: 200,
      message: "Password changed successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: String(user.role),
      },
    };
  }
  async doctor_register(body: DoctorRegisterDto, file: Express.Multer.File) {
    const email = this.normalizeEmail(body.email);

    // location arrives as a JSON string from multipart/form-data
    if (typeof body.location === "string") {
      try {
        body.location = JSON.parse(body.location) as typeof body.location;
      } catch {
        throw new BadRequestException("Invalid location format");
      }
    }

    const user = await this.UserService.findByEmail(email);

    if (!user) {
      throw new BadRequestException("The email does not exist");
    }

    if (!user.verified) {
      throw new BadRequestException("The email is not verified");
    }

    if (user.role !== Role.USER) {
      throw new BadRequestException(
        "The user is already a doctor or has a pending doctor request",
      );
    }

    if (!file) {
      throw new BadRequestException("Medical license is required");
    }

    const uploadedLicense = await this.cloudinaryService.uploadImage(
      file.buffer,
    );

    const doctorRetrun = await this.prisma.$transaction(async (tx) => {
      await this.UserService.update(user.id, {
        role: Role.PENDING_DOCTOR,
      });

      const doctor = await this.doctorService.create(
        {
          ...body,
          medical_license_url: uploadedLicense,
        },
        user.id,
      );
      await tx.auditlog.create({
        data: {
          user_id: user.id,
          action: `New medical license verification pending for Dr. ${user.name}`,
        },
      });

      await tx.notification.create({
        data: {
          user_id: user.id,
          message: `Your doctor registration request has been submitted successfully. Our team will review your application and notify you once it's approved.`,
          title: "Doctor Registration Request Submitted",
          isRead: false,
        },
      });
      await tx.user.update({
        where: { id: user.id },
        data: {
          hide_doctor_button: true,
        },
      });
      return doctor;
    });
    const AdminEmail = await this.prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    });

    if (AdminEmail) {
      this.emitEvent("doctor.registered", {
        email: AdminEmail.email,
        name: AdminEmail.name,
        doctorName: user.name,
        doctorEmail: user.email,
        licenseNumber: body.license_number,
        licenseUrl: uploadedLicense,
        speciality: body.speciality,
        userId: user.id,
      });
    }
    return {
      statusCode: 200,
      message: "Doctor registration request submitted successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: Role.PENDING_DOCTOR,
      },
      doctorRetrun,
    };
  }
  async validateGoogleUser(profile: GoogleProfile) {
    const email = this.normalizeEmail(
      (profile.emails && profile.emails[0]?.value) || "",
    );
    let user = await this.UserService.findByEmail(email);
    let NewUser = false;

    const [token, userReturn] = await this.prisma.$transaction(async (tx) => {
      if (!user) {
        user = await this.UserService.create({
          email,
          name: profile.displayName || "User",
          password: await this.hashPassword(Math.random().toString(36)),
          verified: true,
        });
        NewUser = true;
      }

      const payload: JwtPayload = {
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
      };

      const token = this.signToken(payload, "1d");

      if (NewUser) {
        await tx.auditlog.create({
          data: {
            user_id: user.id,
            action: "New user registered with Google",
          },
        });
        await tx.notification.create({
          data: {
            user_id: user.id,
            message: `Welcome ${user.name}! Thank you for registering`,
            title: "Welcome to Our Platform!",
            isRead: false,
          },
        });
        this.emitEvent("user.created", {
          id: user.id,
          email: user.email,
          name: user.name,
          token: token,
          role: user.role,
          verified: user.verified,
        });
      }
      return [token, user];
    });
    return {
      token,
      user: {
        id: userReturn.id,
        email: userReturn.email,
        name: userReturn.name,
        role: String(userReturn.role),
        verified: userReturn.verified,
      },
    };
  }
  generateTokenForGoogleUser(user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: true,
    };
    const token = this.signToken(payload, "1d");
    return token;
  }
  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(token);
      const user = await this.UserService.findByEmail(decoded.email);
      if (!user) {
        throw new BadRequestException("User not found");
      }
      return {
        statusCode: 200,
        message: "Token is valid",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: String(user.role),
          verified: user.verified,
        },
      };
    } catch (error) {
      console.error("Error validating token:", error);
      throw new ForbiddenException("Invalid or expired token");
    }
  }

  verifyJwtToken(token: string): boolean {
    try {
      this.jwtService.verify<JwtPayload>(token);
      return true;
    } catch (error) {
      console.error("Error verifying JWT token:", error);
      return false;
    }
  }

  async hideDoctorButton(userId: string) {
    const user: User | null = await this.UserService.findById(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    return {
      statusCode: 200,
      message: "Doctor button hidden successfully",
      hide_doctor_button: user.hide_doctor_button,
    };
  }

  async updateHideDoctorButton(userId: string) {
    const user = await this.UserService.findById(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    await this.UserService.update(userId, {
      hide_doctor_button: !user.hide_doctor_button,
    });
    return {
      statusCode: 200,
      message: "Hide doctor button updated successfully",
      hide_doctor_button: !user.hide_doctor_button,
    };
  }
}
