import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UserFinishRegisterDto } from '../../../api/v1/user/dtos/user.dto';
import { BaseValidatorService } from '../../../services/validators/base-validator/base-validator.service';
import { UserService } from '../../../api/v1/user/services/user/user.service';

@Injectable()
export class ValidateUserRegistrationDtoPipe implements PipeTransform {
  constructor(
    private readonly baseValidator: BaseValidatorService,
    private readonly userService: UserService,
  ) {}
  async transform(value: UserFinishRegisterDto, metadata: ArgumentMetadata) {
    const errors: string[] = [];
    if (!this.baseValidator.isValidPrismaEnumValue(value.gender, 'Gender'))
      errors.push('This is not a valid value for gender');
    if (!this.baseValidator.isValidPrismaEnumValue(value.region, 'Region'))
      errors.push('This is not a valid value for region');
    if (
      !this.baseValidator.isAllStringsValid(
        { ignoreWhitespace: true },
        value.firstName,
        value.lastName,
      )
    )
      errors.push('The name and last name are required');
    console.log(value);
    if (
      (await this.userService.getUser({ username: value.username })) !== null
    ) {
      errors.push('A user with this username already exists');
    }
    if (errors.length > 0)
      throw new BadRequestException({
        message: `We can't create the user with the information given`,
        errors: errors,
      });
    return value;
  }
}
