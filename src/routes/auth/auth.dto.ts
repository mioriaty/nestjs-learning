import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Match } from 'src/shared/decorators/match.decorator';

export class LoginBodyDTO {
  @IsString({ message: 'Email must be string' })
  @IsEmail({}, { message: 'Email must be valid email' })
  email!: string;

  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password!: string;
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsString({ message: 'Confirm password must be string' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('password', { message: 'Confirm password does not match password' })
  confirmPassword!: string;
}

export class RefreshTokenBodyDTO {
  @IsString({ message: 'Refresh token must be string' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken!: string;
}

export class LogoutBodyDTO extends RefreshTokenBodyDTO {}
