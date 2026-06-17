import { AccountStatusEnum, LanguageEnum, MotherStageEnum } from '../enum/user.enum';

export interface UpdateProfileBody {
  firstName: string;
  lastName: string;
  language: LanguageEnum;
  state: string;
  lga: string;
  motherStage: MotherStageEnum;
  targetDate: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  language: LanguageEnum | null;
  state: string | null;
  lga: string | null;
  motherStage: MotherStageEnum | null;
  targetDate: Date | null;
  accountStatus: AccountStatusEnum;
  emailVerified: boolean;
  profileCompleted: boolean;
}


export interface ProfileCompletionFields {
  firstName: string | null;
  lastName: string | null;
  language: LanguageEnum | null;
  state: string | null;
  lga: string | null;
  motherStage: MotherStageEnum | null;
}

export interface SetProfileBody {
  firstName: string;
  type: 'PREGNANT' | 'NEW_MOM';
  targetDate: string;
}