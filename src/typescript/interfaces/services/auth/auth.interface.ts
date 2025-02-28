import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

import { JwtTokens } from '../../models/auth/auth.model';

import { UserRegisterDto } from '../../../../api/v1/user/dtos/user.dto';

export interface AuthServiceBase {
  startUserRegister(
    userDto: UserRegisterDto,
  ): Promise<Pick<JwtTokens, 'refreshToken'>>;
  createUserRegistrationToken(
    email: string,
    option?: JwtSignOptions,
  ): Promise<string>;
  validateToken<TResult extends object>(token: string, option?: JwtVerifyOptions): TResult;
}
