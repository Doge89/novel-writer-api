import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../services/database/prisma/prisma.service';
import { Tags } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAllTags(): Promise<Tags[]> {
    return this.prismaService.tags.findMany();
  }
}
