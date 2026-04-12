import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './services/tag.service';
import { DatabaseManagerModule } from '../../../services/database/database-manager.module';

@Module({
  imports: [DatabaseManagerModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
