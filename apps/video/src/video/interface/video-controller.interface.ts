import { IAuthUser } from '../../common/types/global-types';

export interface IVideoServiceCreateVideo {
  user: IAuthUser;
  title: string;
  file: Express.Multer.File;
}

export interface IVideoServiceUploadVideo {
  id: string;
  extension: string;
  buffer: Buffer;
}
