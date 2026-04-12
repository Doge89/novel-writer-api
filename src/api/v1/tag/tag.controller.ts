import { Controller, Get } from '@nestjs/common';
import { TagService } from './services/tag.service';
import { Tags } from '@prisma/client';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  public async getAllTags(): Promise<Tags[]> {
    return this.tagService.getAllTags();
  }
}
