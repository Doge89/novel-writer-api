import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

import { BaseValidatorService } from '../../validators/base-validator/base-validator.service';
import { CryptoServiceBase } from '../../../typescript/interfaces/services/auth/crypto.interface';

@Injectable()
export class CryptoService implements CryptoServiceBase {
  constructor(private readonly baseValidatorService: BaseValidatorService) {}

  public async encryptString(
    input: string,
    isPassword: boolean = false,
  ): Promise<string> {
    if (isPassword && !this.baseValidatorService.isValidPassword(input)) {
      return Promise.reject('Password is invalid');
    }
    return await bcrypt.hash(input, await this.generateSaltValue());
  }

  public async generateSaltValue(
    rounds: number = 10,
    minor: 'a' | 'b' = 'b',
  ): Promise<string> {
    return await bcrypt.genSalt(rounds, minor);
  }

  public async isTextSameAsEncrypted(
    plainText: string,
    encrypted: string,
  ): Promise<boolean> {
    if (
      !this.baseValidatorService.isValidString(encrypted, {
        ignoreWhitespace: true,
      })
    )
      return Promise.resolve(false);
    return await bcrypt.compare(plainText, encrypted);
  }
}
