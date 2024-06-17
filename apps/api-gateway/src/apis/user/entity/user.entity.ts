import { IsEmail, MinLength } from 'class-validator';
import { Video } from 'src/apis/video/entity/video.entity';
import { UserRole } from 'src/common/enum/global-enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @MinLength(4)
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Normal,
    nullable: false,
  })
  role: UserRole;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];
}
