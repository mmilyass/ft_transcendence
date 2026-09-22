import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  Header,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgetPasswordDto } from "./dto/forget_password.dto";
import { ChangePasswordDto } from "./dto/ChangePassword.dto";
import { DoctorRegisterDto } from "./dto/DoctorRegister.dto";
import { Role } from "@prisma/client";
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";
import { MetricsService } from "src/metrics/metrics.service";
import { Public } from "src/auth/decorator/public.decorator";
import { FileInterceptor } from "@nestjs/platform-express/multer/interceptors/file.interceptor";
import { DoctorLocation } from "src/doctor-location/type";

interface UserAuth {
  sub: string;
  id: string;
  email: string;
  verified: boolean;
  name: string;
  role: Role;
  token: string;
  image: string;
  doctor?: {
    id: number;
    specialty: string;
    locations: DoctorLocation[];
    experience: number;
    bio: string;
    rating: number;
    totalPatients: number;
    languages: string[];
    reviewsCount: number;
    profileImage: string;
    speciality: string;
  };
}
export interface UserGoogleAuth {
  id: string;
  email: string;
  name: string;
  access_token: string;
  refresh_token: string;
}
interface RequestWithUser extends Request {
  user: UserAuth;
}

@Controller("auth")
export class AuthController {
  constructor(
    private Authservice: AuthService,
    private MetricsService: MetricsService,
  ) { }

  @Get("hide_doctor_button")
  hideDoctorButton(@Req() req: RequestWithUser) {
    return this.Authservice.hideDoctorButton(req.user.sub);
  }

  @Patch("update_hide_doctor_button")
  updateHideDoctorButton(@Req() req: RequestWithUser) {
    return this.Authservice.updateHideDoctorButton(req.user.sub);
  }
  @Public()
  @Get("test")
  test() {
    return "test";
  }
  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() { }

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const user = req.user;
    const token = this.Authservice.generateTokenForGoogleUser(user);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    await this.MetricsService.incrementSession();
    res.redirect(`${process.env.FRONTEND_URL}/google-callback`);
  }

  @Public()
  @Get("verify/:token")
  verifyToken(@Param("token") token: string) {
    const isValid = this.Authservice.verifyJwtToken(token);
    if (isValid) {
      return { valid: true };
    } else {
      return { valid: false };
    }
  }
  @Public()
  @Post("register")
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.Authservice.register(body);
    res.cookie("access_token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    await this.MetricsService.incrementSession();
    return { user: result.user };
  }
  @Public()
  @Post("login")
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.Authservice.login(body);

    res.cookie("access_token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await this.MetricsService.incrementSession();
    return {
      user: result.user,
    };
  }
  @Public()
  @Post("forgot-password")
  async forget(@Body() body: ForgetPasswordDto) {
    await this.MetricsService.incrementSession();
    return await this.Authservice.forget_password(body);
  }
  @Get("verify_email/token=:token")
  async verifyEmail(
    @Param("token") token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.Authservice.verify_email(token);

    res.clearCookie("token");
    res.cookie("access_token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      statusCode: result.statusCode,
      message: result.message,
      user: result.user,
    };
  }
  @Public()
  @Patch("reset-password/token=:token")
  async reset_password(
    @Param("token") token: string,
    @Body("new_password") new_password: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.Authservice.reset_password(token, new_password);
    res.clearCookie("token");
    res.cookie("access_token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      statusCode: result.statusCode,
      message: result.message,
      user: result.user,
    };
  }
  @Patch("change-password")
  async change_password(
    @Body() ChangePassword: ChangePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    const { old_password, new_password } = ChangePassword;
    return await this.Authservice.change_password(
      String(req.user.sub),
      old_password,
      new_password,
    );
  }
  @Get("me")
  @Header("Cache-Control", "no-store")
  @Header("Pragma", "no-cache")
  @Header("Expires", "0")
  getMe(@Req() req: RequestWithUser): UserAuth {
    return req.user;
  }
  @Public()
  @Post("doctor-register")
  @UseInterceptors(FileInterceptor("medical_license"))
  async doctor_register(
    @Body() body: DoctorRegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.Authservice.doctor_register(body, file);
  }
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token");
    await this.MetricsService.decrementSession();
    return {
      message: "Logged out successfully",
      success: true,
    };
  }
}
