import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { RiskLevelEnum } from '../enum/login-audit.enum';

@Entity('login_audits')
@Index('idx_login_audits_user_id', ['userId'])
@Index('idx_login_audits_user_logged_in', ['userId', 'loggedInAt'])
export class LoginAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'varchar', nullable: true })
  deviceId: string | null;

  @Column()
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ type: 'varchar', nullable: true })
  country: string | null;

  @Column({ type: 'varchar', nullable: true })
  city: string | null;

  @Column({ type: 'simple-enum', enum: RiskLevelEnum })
  riskLevel: RiskLevelEnum;

  @Column({ type: 'jsonb', nullable: true })
  flags: string[] | null;

  @CreateDateColumn({ type: 'timestamptz' })
  loggedInAt: Date;
}
