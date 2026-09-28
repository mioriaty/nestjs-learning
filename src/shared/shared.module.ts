import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { HashingService } from './services/hashing/hashing.service';
import { TokenService } from './services/token/token.service';
import { JwtModule } from '@nestjs/jwt';

const sharedServices = [PrismaService, HashingService, TokenService];

@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
