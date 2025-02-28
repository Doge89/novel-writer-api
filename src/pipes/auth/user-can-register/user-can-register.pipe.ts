import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { UserRegisterDto } from '../../../api/v1/user/dtos/user.dto';
import { BaseValidatorService } from '../../../services/validators/base-validator/base-validator.service';

@Injectable()
export class UserCanRegisterPipe implements PipeTransform {
  constructor(private readonly baseValidatorService: BaseValidatorService) {}
  transform(value: UserRegisterDto, metadata: ArgumentMetadata) {
    if (value.email === undefined || value.password === undefined) {
      throw new BadRequestException('User cannot register');
    }
    if (
      !this.baseValidatorService.isValidPassword(value.password) ||
      !this.baseValidatorService.isValidEmail(value.email)
    ) {
      throw new BadRequestException('User cannot register');
    }
    return value;
  }
}
