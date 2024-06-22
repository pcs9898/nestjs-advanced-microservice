import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'video-service',
        port: 3002,
      },
    },
  );

  await app.listen();
  console.info(`video-service listening on 3002 for tcp`);
}
bootstrap();
