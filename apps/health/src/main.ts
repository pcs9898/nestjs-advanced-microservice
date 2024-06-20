import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'health-service',
        port: 3004,
      },
    },
  );
  await app.listen();
  console.info(`health-service listening on 3004 for tcp`);
}
bootstrap();
