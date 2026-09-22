import { Module } from "@nestjs/common";
import { UserStatsService } from "./user-stats.service";
import { UserStatsController } from "./user-stats.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [UserStatsController],
  providers: [UserStatsService, PrismaService],
})
export class UserStatsModule {}
