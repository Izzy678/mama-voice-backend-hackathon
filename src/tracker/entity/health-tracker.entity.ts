import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('health_tracker')
@Index('idx_health_tracker_user_id', ['userId'])
export class HealthTrackerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'date' })
  logDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weightKg: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  bloodPressure: string | null;

  @Column({ type: 'text', nullable: true })
  nutritionNotes: string | null;

  @Column({ type: 'text', nullable: true })
  symptoms: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
