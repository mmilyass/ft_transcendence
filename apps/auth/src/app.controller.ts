import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "./auth/decorator/public.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("test")
  getTest(): string {
    return this.appService.getTest();
  }

  @Get("health")
  @Public()
  healthCheck(): { status: string } {
    return { status: "ok" };
  }
}
