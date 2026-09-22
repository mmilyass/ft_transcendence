import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: 'notification_events',
      exchange: 'domain_events',
      exchangeType: 'topic',
      wildcards: true,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
}

bootstrap();
