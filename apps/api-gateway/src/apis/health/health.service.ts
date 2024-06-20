import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthService {
  constructor(@Inject('HEALTH_SERVICE') private client: ClientProxy) {}

  async healthCheckV1() {
    const pattern = { cmd: 'healthCheckV1' };

    const payload = {};

    const result = await firstValueFrom(this.client.send(pattern, payload));

    return result;
  }
}
