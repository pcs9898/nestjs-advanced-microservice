import { NestFactory } from '@nestjs/core';
import { ScheduledBatchModule } from './scheduled-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(ScheduledBatchModule);
  await app.listen(3000);
}
bootstrap();
