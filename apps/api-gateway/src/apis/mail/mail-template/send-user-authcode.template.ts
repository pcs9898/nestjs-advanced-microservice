import { IMailServiceSendEmailAuthCodeTemplate } from '../interface/mail-service.interface';

export const sendUserServiceAuthCodeTemplate = ({
  username,
  authCode,
}: IMailServiceSendEmailAuthCodeTemplate) => {
  return `    
    <!DOCTYPE html>
    <html>
        <head>
            <title>Welcome. ${username}</title>
        </head>

        <body>
            <div>your verification number is ${authCode}</div>
        </body>
    </html>
    `;
};
