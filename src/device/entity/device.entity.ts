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
import { UserEntity } from 'src/user/entity/user.entity';
import { DevicePlatformEnum } from '../enum/device.enum';

@Entity('devices')
@Index('idx_devices_user_id', ['userId'])
@Index('idx_devices_device_id', ['deviceId'], { unique: true })
@Index('idx_devices_user_device', ['userId', 'deviceId'])
export class DeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  deviceId: string;

  @Column({ type: 'simple-enum', enum: DevicePlatformEnum })
  platform: DevicePlatformEnum;

  @Column({ type: 'varchar', nullable: true })
  deviceModel: string | null;

  @Column({ type: 'text', nullable: true })
  pushNotificationToken: string | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastSeenAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
