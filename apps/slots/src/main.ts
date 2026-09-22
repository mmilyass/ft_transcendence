import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { JwtGuard } from "./auth/guards/jwt.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  if (!process.env.RABBITMQ_URL) {
    throw new Error("RABBITMQ_URL is not set — check your .env");
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: "slots_events",
      exchange: "domain_events",
      exchangeType: "topic",
      wildcards: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalGuards(app.get(JwtGuard));
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 1339);
}
bootstrap();
