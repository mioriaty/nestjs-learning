import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { LoginBodyDTO, LogoutBodyDTO, RefreshTokenBodyDTO, RegisterBodyDTO } from 'src/routes/posts/auth/auth.dto';

import { isRecordNotFoundError, isUniqueConstraintError } from 'src/shared/helpers';
import { HashingService } from 'src/shared/services/hashing/hashing.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { TokenService } from 'src/shared/services/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyDTO) {
    try {
      const { email, password, name } = body;
      const hashPassword = await this.hashService.hash(password);

      const user = await this.prismaService.user.create({
        data: {
          email,
          password: hashPassword,
          name,
        },
      });

      return user;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async login(body: LoginBodyDTO) {
    const { email, password } = body;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // check password
    const isPasswordValid = await this.hashService.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ]);
    }

    const tokens = await this.generateTokens({ userId: user.id });

    return tokens;
  }

  async refreshToken(body: RefreshTokenBodyDTO) {
    const { refreshToken } = body;

    try {
      // verify refresh token
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);

      // check if refresh token exists in database
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: { token: refreshToken },
      });

      // delete old refresh token
      await this.prismaService.refreshToken.delete({
        where: { token: refreshToken },
      });

      // generate new tokens
      return await this.generateTokens({ userId });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      throw new UnauthorizedException();
    }
  }

  async logout(body: LogoutBodyDTO) {
    const { refreshToken } = body;

    try {
      // verify refresh token
      await this.tokenService.verifyRefreshToken(refreshToken);

      // delete old refresh token
      await this.prismaService.refreshToken.delete({
        where: { token: refreshToken },
      });

      return { message: 'Logout successful' };
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      throw new UnauthorizedException();
    }
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ]);

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);

    await this.prismaService.refreshToken.create({
      data: {
        userId: payload.userId,
        token: refreshToken,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    });

    return { accessToken, refreshToken };
  }
}
