import { IsEmail, MinLength } from 'class-validator';

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../common/enum/global-enum';

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
}
