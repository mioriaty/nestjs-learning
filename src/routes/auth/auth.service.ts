import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { RegisterBodyDTO } from 'src/routes/auth/auth.dto';
import { HashingService } from 'src/shared/services/hashing/hashing.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashingService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(body: RegisterBodyDTO) {
    try {
      const { email, password, name } = body;
      const hashPassword = await this.hashService.hash(password);

      const user = await this.prismaService.user.create({
        data: {
          email,
          password: hashPassword,
          name,
        },
      });

      return {
        data: {
          name: user.name,
          email: user.email,
        },
        message: 'Register success',
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
}
