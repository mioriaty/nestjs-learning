import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type { Post as PostType } from 'src/generated/prisma/client';
import { AUTH_TYPE, CONDITION_GUARD } from 'src/shared/constants/auth.constant';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { PostsService } from './posts.service';
import { GetPostItemDTO } from 'src/routes/posts/post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @UseGuards(APIKeyGuard)
  @Auth([AUTH_TYPE.Bearer, AUTH_TYPE.APIKey], { condition: CONDITION_GUARD.OR })
  @Get()
  findAll(@ActiveUser('userId') userId: number) {
    return this.postsService.findAll(userId).then((posts) => posts.map((post) => new GetPostItemDTO(post)));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  @Auth([AUTH_TYPE.Bearer])
  create(@Body() createPostDto: PostType, @ActiveUser('userId') userId: number) {
    return this.postsService.create(createPostDto, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: PostType) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
