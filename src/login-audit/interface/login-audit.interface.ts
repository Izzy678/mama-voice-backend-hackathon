import { RiskLevelEnum } from '../enum/login-audit.enum';

export interface CreateLoginAuditInput {
  userId: string;
  deviceId: string | null;
  ipAddress: string;
  userAgent: string | null;
  country: string | null;
  city: string | null;
  riskLevel: RiskLevelEnum;
  flags: string[] | null;
}

export interface EvaluateLoginRiskInput {
  deviceId: string | null;
  country: string | null;
  timestamp: Date;
}

export interface LoginRiskResult {
  riskLevel: RiskLevelEnum;
  flags: string[] | null;
}

export interface RecordLoginWithRiskAssessmentInput {
  userId: string;
  deviceId: string | null;
  ipAddress: string;
  userAgent: string | null;
  country: string | null;
  city: string | null;
  timestamp: Date;
}
