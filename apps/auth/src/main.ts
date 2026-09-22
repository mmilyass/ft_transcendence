import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { MetricsInterceptor } from "./metrics/metrics.interceptor";
import { JwtGuard } from "./auth/guards/jwt.guard";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.API_GATEWAY ?? "http://api-gateway:8080"],
  });
  app.use(cookieParser());
  app.useGlobalGuards(app.get(JwtGuard));
  app.useGlobalInterceptors(app.get(MetricsInterceptor));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (!process.env.RABBITMQ_URL) {
    throw new Error("RABBITMQ_URL is not set — check your .env");
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: "auth_events",
      exchange: "domain_events",
      exchangeType: "topic",
      wildcards: true,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
