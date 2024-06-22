import { IAuthUser } from 'src/common/types/global-types';

export interface IVideoServiceCreateVideo {
  user: IAuthUser;
  title: string;
  file: Express.Multer.File;
}

export interface IVideoServiceDownloadVideoByIdRes {
  buffer: any;
  mimetype: string;
  size: number;
}
