import { IMailServiceSendEmailAuthCodeTemplate } from '../interface/mail-service.interface';

export const sendUserServiceAuthCodeTemplate = ({
  username,
  authCode,
}: IMailServiceSendEmailAuthCodeTemplate) => {
  return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Welcome, ${username}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f0f0f0;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    margin-top: 10%;
                    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    padding: 10px;
                    color: #333;
                }
                .code {
                    text-align: center;
                    font-size: 20px;
                    color: #5a5a5a;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome, ${username}</h1>
                    <p>Thank you for signing up. Please verify your email using the code below.</p>
                </div>
                <div class="code">
                    <p>Your verification code is:</p>
                    <h2>${authCode}</h2>
                </div>
            </div>
        </body>
    </html>
    `;
};
