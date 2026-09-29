import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type { Post as PostType } from 'src/generated/prisma/client';
import { AUTH_TYPE, CONDITION_GUARD } from 'src/shared/constants/auth.constant';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @UseGuards(APIKeyGuard)
  @Auth([AUTH_TYPE.Bearer, AUTH_TYPE.APIKey], { condition: CONDITION_GUARD.OR })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  create(@Body() createPostDto: PostType) {
    return this.postsService.create(createPostDto);
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
