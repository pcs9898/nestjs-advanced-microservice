import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthService {
  constructor(@Inject('HEALTH_SERVICE') private client: ClientProxy) {}

  async healthCheckV1() {
    return await firstValueFrom(this.client.send({ cmd: 'healthCheckV1' }, {}));
  }
}
