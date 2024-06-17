export interface IMailServiceSendAuthCode {
  email: string;
  authCode: number;
}

export interface IMailServiceSendEmailAuthCodeTemplate {
  username: string;
  authCode: number;
}

export interface IMailServiceSendFindTop5downloadVideosTemplate {
  data: string[];
}
