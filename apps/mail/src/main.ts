import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['host.docker.internal:9092'],
        },
        consumer: {
          groupId: 'mail-consumer',
        },
      },
    },
  );
  kafkaApp.listen();
  console.info(`mail-service listening for kafka requests`);
}
bootstrap();
