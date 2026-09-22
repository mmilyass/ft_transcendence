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

  // The api-gateway's ServiceAvailabilityInterceptor polls this every 10s to
  // decide whether to let /slots, /categories, /services requests through at
  // all. Without it (and without @Public, since JwtGuard is global here),
  // that poll always 404s/401s and the gateway 503s every request to this
  // service, permanently.
  @Get("health")
  @Public()
  healthCheck(): { status: string } {
    return { status: "ok" };
  }
}
