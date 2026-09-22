import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CreateUserDto } from "./dto/createUser.dto";
import { Roles } from "src/auth/decorator/roles.decorator";
import { Role } from "@prisma/client";
import { RolesGuard } from "src/auth/guards/roles.guard";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Post()
  // create(@Body() body: CreateUserDto) {
  //   return this.usersService.create(body);
  // }
  // Note: @Roles is enforced only when RolesGuard is included in @UseGuards
  // Role comes from JwtStrategy validate() -> request.user
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @UseGuards(JwtGuard)
  @Get(":id")
  findById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }
  // This table is just slots' local read cache, kept in sync from the auth
  // service via user.created/user.updated events — it had no guard at all,
  // so any authenticated user could edit or delete any other user's synced
  // row directly over HTTP, bypassing the event flow entirely and out of
  // sync with the source of truth in auth. Restricted to admin, matching
  // findAll() above; real updates should go through auth, not here.
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(":id")
  Update(@Param("id") id: string, @Body() body: Partial<CreateUserDto>) {
    return this.usersService.update(id, body);
  }
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
