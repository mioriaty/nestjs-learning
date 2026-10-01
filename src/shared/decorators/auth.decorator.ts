import { SetMetadata } from '@nestjs/common';
import { AuthType, CONDITION_GUARD, ConditionGuardType } from 'src/shared/constants/auth.constant';

export const AUTH_METADATA_KEY = 'auth';

export type AuthDecoratorPayload = {
  authTypes: AuthType[];
  options: {
    condition: ConditionGuardType;
  };
};

export const Auth = (authTypes: AuthType[], options?: { condition: ConditionGuardType | undefined }) => {
  return SetMetadata(AUTH_METADATA_KEY, {
    authTypes,
    options: options ?? { condition: CONDITION_GUARD.OR },
  });
};
