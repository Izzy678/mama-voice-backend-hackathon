import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/service/email.service';
import {
  securityAlertEmailHtml,
} from 'src/email/templates/email.templates';
import { UserService } from 'src/user/service/user.service';
import { LoginAuditEntity } from '../entity/login-audit.entity';
import { RiskLevelEnum } from '../enum/login-audit.enum';
import {
  CreateLoginAuditInput,
  EvaluateLoginRiskInput,
  LoginRiskResult,
  RecordLoginWithRiskAssessmentInput,
} from '../interface/login-audit.interface';

const IMPOSSIBLE_TRAVEL_WINDOW_MS = 8 * 60 * 60 * 1000;

@Injectable()
export class LoginAuditService {
  private readonly logger = new Logger(LoginAuditService.name);

  constructor(
    @InjectRepository(LoginAuditEntity)
    private readonly loginAuditRepository: Repository<LoginAuditEntity>,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  async createLoginAudit(input: CreateLoginAuditInput): Promise<LoginAuditEntity> {
    const audit = this.loginAuditRepository.create({
      userId: input.userId,
      deviceId: input.deviceId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      country: input.country,
      city: input.city,
      riskLevel: input.riskLevel,
      flags: input.flags,
    });

    return this.loginAuditRepository.save(audit);
  }

  getUserLoginHistory(userId: string): Promise<LoginAuditEntity[]> {
    return this.loginAuditRepository.find({
      where: { userId },
      order: { loggedInAt: 'DESC' },
    });
  }

  getLatestLogin(userId: string): Promise<LoginAuditEntity | null> {
    return this.loginAuditRepository.findOne({
      where: { userId },
      order: { loggedInAt: 'DESC' },
    });
  }

  evaluateLoginRisk(
    latestLogin: LoginAuditEntity | null,
    input: EvaluateLoginRiskInput,
  ): LoginRiskResult {
    if (!latestLogin) {
      return { riskLevel: RiskLevelEnum.Low, flags: ['FIRST_LOGIN'] };
    }

    const flags: string[] = [];
    const sameDevice =
      !!input.deviceId &&
      !!latestLogin.deviceId &&
      input.deviceId === latestLogin.deviceId;
    const sameCountry =
      !!input.country &&
      !!latestLogin.country &&
      input.country === latestLogin.country;
    const newDevice =
      !!input.deviceId &&
      !!latestLogin.deviceId &&
      input.deviceId !== latestLogin.deviceId;
    const countryChanged =
      !!input.country &&
      !!latestLogin.country &&
      input.country !== latestLogin.country;
    const newCountry =
      !!input.country &&
      (!latestLogin.country || input.country !== latestLogin.country);

    let riskLevel = RiskLevelEnum.Low;

    if (sameDevice || sameCountry) {
      riskLevel = RiskLevelEnum.Low;
    } else if (newDevice && newCountry) {
      riskLevel = RiskLevelEnum.High;
      flags.push('NEW_DEVICE_AND_COUNTRY');
    } else if (newDevice) {
      riskLevel = RiskLevelEnum.Medium;
      flags.push('NEW_DEVICE');
    } else if (newCountry || countryChanged) {
      riskLevel = RiskLevelEnum.Medium;
      flags.push('NEW_COUNTRY');
    }

    if (countryChanged) {
      const timeDiff =
        input.timestamp.getTime() - latestLogin.loggedInAt.getTime();
      if (timeDiff < IMPOSSIBLE_TRAVEL_WINDOW_MS) {
        riskLevel = RiskLevelEnum.High;
        flags.push('POSSIBLE_IMPOSSIBLE_TRAVEL');
      }
    }

    return { riskLevel, flags: flags.length ? flags : null };
  }

  async recordLoginWithRiskAssessment(
    input: RecordLoginWithRiskAssessmentInput,
  ): Promise<LoginAuditEntity> {
    const latestLogin = await this.getLatestLogin(input.userId);
    const { riskLevel, flags } = this.evaluateLoginRisk(latestLogin, {
      deviceId: input.deviceId,
      country: input.country,
      timestamp: input.timestamp,
    });

    const audit = await this.createLoginAudit({
      ...input,
      riskLevel,
      flags,
    });

    void this.handleSecurityResponse(audit).catch((error) =>
      this.logger.error(
        `Security response failed for user ${audit.userId}`,
        error,
      ),
    );

    return audit;
  }

  private async handleSecurityResponse(
    audit: LoginAuditEntity,
  ): Promise<void> {
    if (audit.riskLevel === RiskLevelEnum.High) {
      this.logger.warn(
        `High-risk login for user ${audit.userId}: ${audit.flags?.join(', ') ?? 'none'}`,
      );

      const user = await this.userService.find({ id: audit.userId });
      if (user) {
        const flags = audit.flags ?? [];
        await this.emailService.sendEmail({
          to: user.email,
          subject: 'Unusual login activity on your MamaVoice account',
          html: securityAlertEmailHtml({
            flags,
            ipAddress: audit.ipAddress,
            country: audit.country,
            city: audit.city,
            loggedInAt: audit.loggedInAt,
          }),
        });
      }
    } else if (audit.riskLevel === RiskLevelEnum.Medium) {
      this.logger.log(
        `Medium-risk login for user ${audit.userId}: ${audit.flags?.join(', ') ?? 'none'}`,
      );
    }
  }
}
