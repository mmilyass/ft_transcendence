import { Controller } from '@nestjs/common';
import { RabbitMqService } from './rabbitmq.service';

@Controller('rabbitmq')
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitMqService) {}
}
