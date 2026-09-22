import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService {
  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('RabbitMQ connection failed:', error);
    }
  }
  emit(pattern: string, data: unknown) {
    return this.client.emit(pattern, data);
  }
}
