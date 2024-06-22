import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3006);
  console.info(`schedule-batch-service listening on 3006`);
}
bootstrap();
