import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants/auth.constant';
import { TokenService } from '../services/token/token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken: string = request.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const decodedToken = await this.tokenService.verifyAccessToken(accessToken);
      request[REQUEST_USER_KEY] = decodedToken;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
