import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { PostModel } from 'src/shared/models/post.model';
import { UserModel } from 'src/shared/models/user.model';

export class GetPostItemDTO extends PostModel {
  @Type(() => UserModel)
  author!: Omit<UserModel, 'password'>;

  constructor(data: Partial<GetPostItemDTO>) {
    super(data);
    Object.assign(this, data);
  }
}

export class CreatePostBodyDTO {
  @IsString()
  title!: string;

  @IsString()
  content!: string;
}

export class UpdatePostBodyDTO extends CreatePostBodyDTO {}

export class DeletePostDTO {
  @IsString()
  message!: string;

  constructor(data: Partial<DeletePostDTO>) {
    Object.assign(this, data);
  }
}
