import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { HashingService } from './services/hashing/hashing.service';

const sharedServices = [PrismaService, HashingService];

@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
