import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ServicesService } from "./services.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { Public } from "src/auth/decorator/public.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import type { RequestWithUser } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "@prisma/client";

@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // doctorId used to come straight from the request body with no check that
  // the caller actually owned it — any authenticated user could create a
  // service under any other doctor's id. ServicesService now verifies the
  // caller against the resolved doctor row.
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.servicesService.createService(
      createServiceDto.doctorId,
      createServiceDto,
      req.user.sub,
    );
  }

  @Public()
  @Get(":doctorId")
  findAll(@Param("doctorId") doctorId: string) {
    return this.servicesService.findAllServices(doctorId);
  }

  @Public()
  @Get(":doctorId/:serviceId")
  findOne(
    @Param("doctorId") doctorId: string,
    @Param("serviceId") serviceId: string,
  ) {
    return this.servicesService.findServiceById(doctorId, serviceId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Patch(":doctorId/:serviceId")
  update(
    @Req() req: RequestWithUser,
    @Param("doctorId") doctorId: string,
    @Param("serviceId") serviceId: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.updateService(
      doctorId,
      serviceId,
      updateServiceDto,
      req.user.sub,
    );
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Delete(":doctorId/:serviceId")
  remove(
    @Req() req: RequestWithUser,
    @Param("doctorId") doctorId: string,
    @Param("serviceId") serviceId: string,
  ) {
    return this.servicesService.removeService(
      doctorId,
      serviceId,
      req.user.sub,
    );
  }
}
