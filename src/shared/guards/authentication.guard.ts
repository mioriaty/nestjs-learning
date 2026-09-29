import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_METADATA_KEY, AuthDecoratorPayload } from '../decorators/auth.decorator';
import { AccessTokenGuard } from './access-token.guard';
import { APIKeyGuard } from './api-key.guard';
import { AUTH_TYPE, CONDITION_GUARD } from '../constants/auth.constant';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate> = {
    [AUTH_TYPE.Bearer]: this.accessTokenGuard,
    [AUTH_TYPE.APIKey]: this.apiKeyGuard,
    [AUTH_TYPE.None]: {
      canActivate: () => true,
    },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: APIKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValues = this.reflector.getAllAndOverride<AuthDecoratorPayload | undefined>(AUTH_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authTypes: [AUTH_TYPE.None], options: { condition: CONDITION_GUARD.OR } };

    const guards = authTypeValues.authTypes.map((authType) => this.authTypeGuardMap[authType]);
    let error = new UnauthorizedException();

    if (authTypeValues.options.condition === CONDITION_GUARD.OR) {
      for (const instance of guards) {
        const canActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
          error = err;
          return false;
        });
        if (canActivate) {
          return true;
        }
      }
      throw error;
    } else {
      for (const instance of guards) {
        const canActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
          error = err;
          return false;
        });
        if (!canActivate) {
          throw new UnauthorizedException();
        }
      }
      return true;
    }
  }
}
