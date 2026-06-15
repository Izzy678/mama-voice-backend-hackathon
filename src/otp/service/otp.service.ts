import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { CreatedOtpResult, OtpPublic } from '../interface/otp.interface';
import { OtpEntity } from '../entity/otp.entity';
import { OtpPurposeEnum } from '../enum/otp.enum';
import { generateOtpCode, getOtpExpiryDate } from '../utils/otp.util';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
  ) { }

  async createOtp(userId: string): Promise<CreatedOtpResult> {
    await this.invalidatePendingOtps(userId, OtpPurposeEnum.EmailVerification);

    const code = generateOtpCode();

    const record = await this.otpRepository.save(
      this.otpRepository.create({
        userId,
        code,
        purpose: OtpPurposeEnum.EmailVerification,
        expiresAt: getOtpExpiryDate(),
        usedAt: null,
      }),
    );

    return {
      otp: this.toPublicOtp(record),
      code,
    };
  }

  async verifyOtp(otpId: string, code: string): Promise<string> {
    const record = await this.otpRepository.findOne({
      where: {
        id: otpId,
        purpose: OtpPurposeEnum.EmailVerification,
        usedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!record || record.code !== code) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.otpRepository.update(record.id, { usedAt: new Date() });
    return record.userId;
  }

  toPublicOtp(record: OtpEntity): OtpPublic {
    return {
      id: record.id,
      purpose: record.purpose,
      expiresAt: record.expiresAt,
      createdAt: record.createdAt,
    };
  }

  private async invalidatePendingOtps(
    userId: string,
    purpose: OtpPurposeEnum,
  ): Promise<void> {
    await this.otpRepository.update(
      { userId, purpose, usedAt: IsNull() },
      { usedAt: new Date() },
    );
  }
}
