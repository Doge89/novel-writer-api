import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MailgunService } from './mailgun/mailgun.service';
import { ValidatorsModule } from '../validators/validators.module';

@Module({
  imports: [HttpModule, ValidatorsModule],
  providers: [MailgunService],
  exports: [MailgunService],
})
export class EmailModule {}
