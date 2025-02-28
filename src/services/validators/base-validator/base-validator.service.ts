import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { ValidateStringOptions } from '../../../typescript/interfaces/services/base/validators.interface';
import {
  STRING_CONTAINS_SPECIAL_CHARACTERS,
  STRING_IS_ALPHANUMERIC,
  IS_STRING_VALID_EMAIL,
  MIN_PASSWORD_LENGTH,
} from '../../../config/constants';
import { PrismaEnum, PrismaEnumKeys } from "../../../typescript/types/base.types";

@Injectable()
export class BaseValidatorService {
  public validateObjectWithType<TObject extends object>(
    object: unknown,
    expected: (keyof TObject)[],
  ): object is TObject {
    const keys = Object.keys(object);
    return (
      keys.length === expected.length &&
      expected.every((key) => keys.includes(key as string))
    );
  }
  public isValuePrimitive(value: unknown): boolean {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    );
  }
  public isValidString(
    input: string,
    options?: ValidateStringOptions,
  ): boolean {
    if (typeof input !== 'string') return false;
    if (input.length === 0) return false;
    if (options === undefined) return true;
    if (
      options.ignoreWhitespace !== undefined &&
      options.ignoreWhitespace &&
      input.trim().length === 0
    )
      return false;
    return options.invalidateIfStringIsFalse ? input === 'true' : true;
  }
  public isAllStringsValid(
    options: Partial<ValidateStringOptions>,
    ...values: string[]
  ): boolean {
    return values.every((value: string) => this.isValidString(value, options));
  }
  public isValidForIndex(value: unknown): value is number | string {
    return typeof value === 'number' || typeof value === 'string';
  }
  public isValidPassword(input: string): boolean {
    if (!this.isValidString(input, { ignoreWhitespace: true })) return false;
    if (!STRING_IS_ALPHANUMERIC.test(input)) return false;
    if (!STRING_CONTAINS_SPECIAL_CHARACTERS.test(input)) return false;
    return input.length >= MIN_PASSWORD_LENGTH;
  }
  public isValidEmail(input: string): boolean {
    if (!this.isValidString(input, { ignoreWhitespace: true })) return false;
    return IS_STRING_VALID_EMAIL.test(input);
  }

  public isValidPrismaEnumValue<TEnumPrisma extends PrismaEnumKeys>(
    value: unknown,
    key: TEnumPrisma,
  ): boolean {
    if (!this.isValuePrimitive(value)) return false;
    if (!this.isValidForIndex(value)) return false;
    return !!$Enums[key][value];
  }
}
