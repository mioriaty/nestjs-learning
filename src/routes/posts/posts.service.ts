import { Injectable } from '@nestjs/common';

import type { Post as PostType } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(userId: number) {
    console.log('userId', userId);

    return this.prismaService.post.findMany({
      where: { authorId: userId },
      include: {
        author: {
          omit: { password: true },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.post.findUnique({
      where: {
        id: id,
      },
    });
  }

  create(post: PostType, userId: number) {
    return this.prismaService.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: userId,
      },
    });
  }

  update(id: string, post: Omit<PostType, 'id'>) {
    return { id, ...post };
  }

  remove(id: string) {
    return `Remove post #${id}`;
  }
}
