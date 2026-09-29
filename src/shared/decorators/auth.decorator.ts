import { SetMetadata } from '@nestjs/common';
import { AuthType, ConditionGuardType } from 'src/shared/constants/auth.constant';

export const AUTH_METADATA_KEY = 'auth';

export type AuthDecoratorPayload = {
  authTypes: AuthType[];
  options: {
    condition: ConditionGuardType;
  };
};

export const Auth = (authTypes: AuthType[], options: { condition: ConditionGuardType }) => {
  return SetMetadata(AUTH_METADATA_KEY, { authTypes, options });
};
