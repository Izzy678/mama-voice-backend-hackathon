import { AccountStatusEnum, LanguageEnum, MotherStageEnum } from '../enum/user.enum';

export type ProfileType = 'PREGNANT' | 'NEW_MOM';

export interface SetProfileBody {
  firstName: string;
  type: ProfileType;
  targetDate: string;
}

export interface UpdateProfileBody {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  language: LanguageEnum;
  state: string;
  lga: string;
  motherStage: MotherStageEnum;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  language: LanguageEnum | null;
  state: string | null;
  lga: string | null;
  motherStage: MotherStageEnum | null;
  accountStatus: AccountStatusEnum;
  emailVerified: boolean;
  profileCompleted: boolean;
}


export interface ProfileCompletionFields {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  language: LanguageEnum | null;
  state: string | null;
  lga: string | null;
  motherStage: MotherStageEnum | null;
}