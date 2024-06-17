import { IMailServiceSendFindTop5downloadVideosTemplate } from '../interface/mail-service.interface';

export const SendFindTop5downloadVideosTemplate = ({
  data,
}: IMailServiceSendFindTop5downloadVideosTemplate) => {
  return `
    <table style="border: 1px solid black; width: 60%; margin: auto; text-align: center;">
    <tr><th>id</th><th>title</th><th>download count</th></tr>
    ${data}
    </table>
    `;
};
