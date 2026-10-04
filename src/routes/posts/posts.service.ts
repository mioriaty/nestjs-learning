import { Injectable, NotFoundException } from '@nestjs/common';

import { CreatePostBodyDTO, UpdatePostBodyDTO } from 'src/routes/posts/post.dto';
import { isRecordNotFoundError } from 'src/shared/helpers';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userId: number) {
    try {
      const posts = this.prismaService.post.findMany({
        where: { authorId: userId },
        include: {
          author: {
            omit: { password: true },
          },
        },
      });
      return posts;
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new NotFoundException('Post not found');
      }
      throw error;
    }
  }

  async findOne(postId: number) {
    try {
      const post = await this.prismaService.post.findUniqueOrThrow({
        where: { id: postId },
        include: {
          author: {
            omit: { password: true },
          },
        },
      });
      return post;
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new NotFoundException('Post not found');
      }
      throw error;
    }
  }

  async create(post: CreatePostBodyDTO, userId: number) {
    return this.prismaService.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: userId,
      },
    });
  }

  async update(postId: number, post: UpdatePostBodyDTO, userId: number) {
    try {
      const updatedPost = await this.prismaService.post.update({
        where: { id: postId, authorId: userId },
        data: {
          title: post.title,
          content: post.content,
        },
        include: {
          author: {
            omit: { password: true },
          },
        },
      });

      return updatedPost;
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new NotFoundException('Post not found');
      }
      throw error;
    }
  }

  async remove(postId: number, userId: number) {
    try {
      await this.prismaService.post.delete({
        where: {
          id: postId,
          authorId: userId,
        },
      });

      return {
        message: 'Delete successfully',
      };
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new NotFoundException('Post not found');
      }
      throw error;
    }
  }
}
