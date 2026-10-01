import { Exclude } from 'class-transformer';

export class UserModel {
  id!: number;
  email!: string;
  name!: string;

  @Exclude()
  password!: string;

  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Partial<UserModel>) {
    Object.assign(this, data);
  }
}
