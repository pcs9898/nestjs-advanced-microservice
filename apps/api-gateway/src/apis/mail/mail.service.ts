import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMailServiceSendAuthCode } from './interface/mail-service.interface';
import { sendUserServiceAuthCodeTemplate } from './mail-template/send-user-authcode.template';
import { Video } from '../video/entity/video.entity';
import { SendFindTop5downloadVideosTemplate } from './mail-template/find-top5-download-videos.template';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendAuthCode({
    authCode,
    email,
  }: IMailServiceSendAuthCode): Promise<void> {
    const username = email.split('@')[0];
    const mailHtmlData = sendUserServiceAuthCodeTemplate({
      username,
      authCode,
    });

    await this.mailerService
      .sendMail({
        to: email,
        from: this.configService.get('mail.senderEmail'),
        subject: `Hello ${username}`,
        html: mailHtmlData,
      })
      .then(() => {})
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
  }

  async sendFindTop5downloadVideos(videos: Video[]) {
    const data = videos.map(
      ({ id, title, downloadCnt }) => `
        <tr>
        <td>${id}</td>
        <td>${title}</td>
        <td>${downloadCnt}</td>
        </tr>`,
    );

    const mailHtmlData = SendFindTop5downloadVideosTemplate({ data });

    await this.mailerService
      .sendMail({
        to: this.configService.get('mail.senderEmail'),
        from: 'nesttube@nesttube.com',
        subject: 'Top 5 downloaded Videos by Nest Tube',
        html: mailHtmlData,
      })
      .then(() => {})
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
  }
}
