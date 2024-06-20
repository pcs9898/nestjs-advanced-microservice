import { Controller } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { MessagePattern } from '@nestjs/microservices';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @MessagePattern({ cmd: 'healthCheckV1' })
  @HealthCheck()
  async checkV1() {
    return await this.healthService.healthCheckV1();
  }
}
