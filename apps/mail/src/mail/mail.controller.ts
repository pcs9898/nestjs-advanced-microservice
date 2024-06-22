import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { Controller } from '@nestjs/common';
import { IMailServiceSendUserAuthCode } from './interface/mail-service.interface';
import { Video } from './entity/video.entity';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('sendUserAuthCode', Transport.KAFKA)
  async sendUserAuthCode(
    @Payload() data: IMailServiceSendUserAuthCode,
  ): Promise<void> {
    this.mailService.sendUserAuthCode(data);
  }

  @EventPattern('sendFindTop5downloadVideos', Transport.KAFKA)
  async sendFindTop5downloadVideos(@Payload() data: Video[]): Promise<void> {
    this.mailService.sendFindTop5downloadVideos(data);
  }
}
