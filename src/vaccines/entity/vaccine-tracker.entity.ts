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

@Entity('vaccine_tracker')
@Index('idx_vaccine_tracker_user_id', ['userId'])
@Index('idx_vaccine_tracker_user_vaccine', ['userId', 'vaccineId'], { unique: true })
export class VaccineTrackerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 20 })
  vaccineId: string;

  @Column({ type: 'varchar', length: 200 })
  vaccineName: string;

  @Column({ type: 'varchar', length: 50 })
  dueDateString: string;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ type: 'date', nullable: true })
  administeredDate: Date | null;

  @Column({ type: 'text', nullable: true })
  sideEffects: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
