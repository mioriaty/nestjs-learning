import { Injectable } from '@nestjs/common';

import { Post } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.post.findMany();
  }

  findOne(id: number) {
    return this.prismaService.post.findUnique({
      where: {
        id: id,
      },
    });
  }

  create(post: Post) {
    return this.prismaService.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: post.authorId,
      },
    });
  }

  update(id: string, post: Omit<Post, 'id'>) {
    return { id, ...post };
  }

  remove(id: string) {
    return `Remove post #${id}`;
  }
}
