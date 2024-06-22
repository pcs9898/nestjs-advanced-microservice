import { IMailServiceSendFindTop5downloadVideosTemplate } from '../interface/mail-service.interface';

export const SendFindTop5downloadVideosTemplate = ({
  data,
}: IMailServiceSendFindTop5downloadVideosTemplate) => {
  return `
    <!DOCTYPE html>
    <html>
        <head>
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
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #4CAF50;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Top 5 Downloaded Videos</h2>
                <table>
                    <tr><th>id</th><th>title</th><th>download count</th></tr>
                    ${data}
                </table>
            </div>
        </body>
    </html>
    `;
};
