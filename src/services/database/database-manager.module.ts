import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  exports: [PrismaService],
  providers: [PrismaService],
})
export class DatabaseManagerModule {}
