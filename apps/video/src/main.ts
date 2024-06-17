import { NestFactory } from '@nestjs/core';
import { VideoModule } from './video.module';

async function bootstrap() {
  const app = await NestFactory.create(VideoModule);
  await app.listen(3000);
}
bootstrap();
