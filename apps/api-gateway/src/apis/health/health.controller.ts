import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get('/v1')
  @HealthCheck()
  async checkV1() {
    return await this.healthService.healthCheckV1();
  }
}
