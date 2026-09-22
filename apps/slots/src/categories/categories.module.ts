import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  // AuthModule is what actually provides JwtService for JwtGuard — without
  // it, adding @UseGuards(JwtGuard, ...) to the controller crashes at boot
  // with "Nest can't resolve dependencies of the JwtGuard".
  imports: [PrismaModule, AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
