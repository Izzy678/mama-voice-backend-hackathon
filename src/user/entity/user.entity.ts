import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AccountStatusEnum,
  LanguageEnum,
  MotherStageEnum,
} from '../enum/user.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'simple-enum', enum: AccountStatusEnum })
  accountStatus: AccountStatusEnum;

  @Column({ type: 'simple-enum', enum: MotherStageEnum, nullable: true })
  motherStage: MotherStageEnum | null;

  @Column({ type: 'simple-enum', enum: LanguageEnum, nullable: true })
  language: LanguageEnum | null;

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', nullable: true })
  state: string | null;

  @Column({ type: 'varchar', nullable: true })
  lga: string | null;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'date', nullable: true })
  targetDate: Date | null;

  @Column({ type: 'boolean', default: false })
  profileCompleted: boolean;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
