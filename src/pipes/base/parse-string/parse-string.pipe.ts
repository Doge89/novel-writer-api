import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { BaseValidatorService } from '../../../services/validators/base-validator/base-validator.service';

@Injectable()
export class ParseStringPipe implements PipeTransform {
  constructor(private readonly baseValidator: BaseValidatorService) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.baseValidator.isValuePrimitive(value)) {
      throw new BadRequestException(`Expected value to be a string`);
    }
    if (!this.baseValidator.isValidString(value, { ignoreWhitespace: true }))
      throw new BadRequestException(`The given value is not valid`);
    return value;
  }
}
