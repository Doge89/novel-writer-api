import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { BaseValidatorService } from '../../../services/validators/base-validator/base-validator.service';

@Injectable()
export class IsValidPasswordPipe implements PipeTransform {
  constructor(private readonly baseValidator: BaseValidatorService) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'string')
      throw new BadRequestException('Invalid value for a password');
    if (!this.baseValidator.isValidPassword(value))
      throw new BadRequestException('Invalid value for a password');
    return value;
  }
}
