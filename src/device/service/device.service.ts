import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from '../entity/device.entity';
import { RegisterDeviceInput } from '../interface/device.interface';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  findByUserAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<DeviceEntity | null> {
    return this.deviceRepository.findOne({ where: { userId, deviceId } });
  }

  findByDeviceId(deviceId: string): Promise<DeviceEntity | null> {
    return this.deviceRepository.findOne({ where: { deviceId } });
  }

  async registerOrUpdateOnLogin(
    input: RegisterDeviceInput,
  ): Promise<DeviceEntity> {
    const existing =
      (await this.findByUserAndDeviceId(input.userId, input.deviceId)) ??
      (await this.findByDeviceId(input.deviceId));
    const now = new Date();

    if (existing) {
      await this.deviceRepository.update(existing.id, {
        userId: input.userId,
        platform: input.platform,
        deviceModel: input.deviceModel ?? existing.deviceModel,
        pushNotificationToken:
          input.pushNotificationToken ?? existing.pushNotificationToken,
        lastSeenAt: now,
      });
      return (await this.deviceRepository.findOne({
        where: { id: existing.id },
      }))!;
    }

    const device = this.deviceRepository.create({
      userId: input.userId,
      deviceId: input.deviceId,
      platform: input.platform,
      deviceModel: input.deviceModel ?? null,
      pushNotificationToken: input.pushNotificationToken ?? null,
      lastSeenAt: now,
    });

    return this.deviceRepository.save(device);
  }

  async updatePushNotificationToken(
    userId: string,
    deviceId: string,
    pushNotificationToken: string,
  ): Promise<DeviceEntity> {
    const device = await this.findByUserAndDeviceId(userId, deviceId);
    if (!device) {
      throw new NotFoundException('Device not found');
    }

    await this.deviceRepository.update(device.id, { pushNotificationToken });
    return (await this.deviceRepository.findOne({ where: { id: device.id } }))!;
  }

  async touchLastSeen(userId: string, deviceId: string): Promise<void> {
    await this.deviceRepository.update(
      { userId, deviceId },
      { lastSeenAt: new Date() },
    );
  }
}
