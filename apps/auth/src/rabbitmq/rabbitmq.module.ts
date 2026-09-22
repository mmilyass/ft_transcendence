import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitMqService } from "./rabbitmq.service";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { ConfigModule } from "@nestjs/config/dist/config.module";

@Global()
@Module({
  providers: [RabbitMqService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: "RABBITMQ_SERVICE",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>("RABBITMQ_URL")!],
            exchange: "domain_events",
            exchangeType: "topic",
            wildcards: true,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule, RabbitMqService],
})
export class RabbitMqModule {}
