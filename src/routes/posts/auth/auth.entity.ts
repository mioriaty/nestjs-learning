import { Exclude, Type } from 'class-transformer';
import { SuccessResDTO } from 'src/shared/dtos/response.dto';

class RegisterData {
  id!: number;
  email!: string;
  name!: string;

  @Exclude()
  password!: string;

  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<RegisterData>) {
    Object.assign(this, data);
  }
}

export class RegisterResEntity extends SuccessResDTO {
  @Type(() => RegisterData)
  data!: RegisterData;

  constructor(partial: Partial<RegisterResEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class LoginResEntity {
  accessToken!: string;
  refreshToken!: string;

  constructor(partials: Partial<LoginResEntity>) {
    Object.assign(this, partials);
  }
}

export class RefreshTokenResEntity extends LoginResEntity {}

export class LogoutResEntity {
  message!: string;

  constructor(partials: Partial<LogoutResEntity>) {
    Object.assign(this, partials);
  }
}
