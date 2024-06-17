import { ICommand } from '@nestjs/cqrs';
import { IAuthUser } from 'src/common/types/global-types';

export class UploadVideoCommand implements ICommand {
  constructor(
    public readonly file: Express.Multer.File,
    public readonly title: string,
    public readonly user: IAuthUser,
  ) {}
}
