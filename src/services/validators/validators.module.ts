import { Module } from '@nestjs/common';
import { BaseValidatorService } from './base-validator/base-validator.service';

@Module({
  providers: [BaseValidatorService],
  exports: [BaseValidatorService],
})
export class ValidatorsModule {}
