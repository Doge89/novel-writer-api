import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import secrets from '../../../config/secrets.config';

import { BaseValidatorService } from '../../validators/base-validator/base-validator.service';
import { CryptoServiceBase } from '../../../typescript/interfaces/services/auth/crypto.interface';

@Injectable()
export class CryptoService implements CryptoServiceBase {
  constructor(
    @Inject(secrets.KEY)
    private readonly environment: ConfigType<typeof secrets>,
    private readonly baseValidatorService: BaseValidatorService,
  ) {}

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

  public createRandomHash(size: number): string {
    const salt = crypto.randomBytes(size).toString('hex');
    return crypto.createHash('sha256').update(salt).digest('hex');
  }

  public hashString(input: string): string {
    if (!this.baseValidatorService.isValidString(input)) {
      throw new TypeError('The input is not valid');
    }
    return crypto
      .createHmac('sha256', this.environment.hashToken)
      .update(input)
      .digest('hex');
  }

  public revealHashString(hashedString: string): string {
    return '';
  }
}
