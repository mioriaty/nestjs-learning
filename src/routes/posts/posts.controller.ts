import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreatePostBodyDTO, DeletePostDTO, GetPostItemDTO, UpdatePostBodyDTO } from 'src/routes/posts/post.dto';
import { AUTH_TYPE, CONDITION_GUARD } from 'src/shared/constants/auth.constant';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @UseGuards(APIKeyGuard)
  @Auth([AUTH_TYPE.Bearer, AUTH_TYPE.APIKey], { condition: CONDITION_GUARD.OR })
  @Get()
  async findAll(@ActiveUser('userId') userId: number) {
    return this.postsService.findAll(userId).then((posts) => posts.map((post) => new GetPostItemDTO(post)));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return new GetPostItemDTO(await this.postsService.findOne(id));
  }

  @Post()
  @Auth([AUTH_TYPE.Bearer])
  async create(@Body() createPostDto: CreatePostBodyDTO, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postsService.create(createPostDto, userId));
  }

  @Put(':id')
  @Auth([AUTH_TYPE.Bearer])
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return new GetPostItemDTO(await this.postsService.update(id, updatePostDto, userId));
  }

  @Delete(':id')
  @Auth([AUTH_TYPE.Bearer])
  async remove(@Param('id') id: number, @ActiveUser('userId') userId: number) {
    return new DeletePostDTO(await this.postsService.remove(id, userId));
  }
}
