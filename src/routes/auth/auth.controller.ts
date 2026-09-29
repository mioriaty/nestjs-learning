import { Body, Controller, HttpCode, HttpStatus, Post, SerializeOptions } from '@nestjs/common';
import { LoginBodyDTO, LogoutBodyDTO, RefreshTokenBodyDTO, RegisterBodyDTO } from 'src/routes/auth/auth.dto';
import { LoginResEntity, LogoutResEntity, RefreshTokenResEntity, RegisterResEntity } from 'src/routes/auth/auth.entity';
import { AuthService } from 'src/routes/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResEntity })
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginBodyDTO) {
    return new LoginResEntity(await this.authService.login(body));
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return new RefreshTokenResEntity(await this.authService.refreshToken(body));
  }

  @Post('logout')
  async logout(@Body() body: LogoutBodyDTO) {
    return new LogoutResEntity(await this.authService.logout(body));
  }
}
