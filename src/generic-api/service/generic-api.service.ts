import { Injectable } from '@nestjs/common';
import { DevicePlatformEnum } from '../../device/enum/device.enum';
import {
  FoodCategoryEnum,
  FoodStageEnum,
  TrimesterEnum,
} from '../../foods/enum/food.enum';
import {
  LanguageEnum,
  MotherStageEnum,
  ProfileTypesEnum,
} from '../../user/enum/user.enum';
import {
  NIGERIA_STATE_LGAS,
  NIGERIAN_STATES,
} from '../../user/constants/nigeria.constants';

@Injectable()
export class GenericApiService {
  getEnums() {
    return {
      profileTypes: Object.values(ProfileTypesEnum),
      languages: Object.values(LanguageEnum),
      motherStages: Object.values(MotherStageEnum),
      foodCategories: Object.values(FoodCategoryEnum),
      foodStages: Object.values(FoodStageEnum),
      trimesters: Object.values(TrimesterEnum),
      devicePlatforms: Object.values(DevicePlatformEnum),
      states: NIGERIAN_STATES,
      stateLgas: NIGERIA_STATE_LGAS,
    };
  }
}
