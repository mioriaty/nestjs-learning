import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginBodyDTO {
  @IsString({ message: 'Email must be string' })
  @IsEmail({}, { message: 'Email must be valid email' })
  email!: string;

  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsString({ message: 'Confirm password must be string' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword!: string;
}
