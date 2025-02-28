import { User } from '@prisma/client';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { UserService } from '../../../user/services/user/user.service';

import { AuthServiceBase } from '../../../../../typescript/interfaces/services/auth/auth.interface';

import {
  JwtDecodedBase,
  JwtTokens,
} from '../../../../../typescript/interfaces/models/auth/auth.model';
import { CryptoService } from '../../../../../services/auth/crypto/crypto.service';
import { UserRegisterDto } from '../../../user/dtos/user.dto';

@Injectable()
export class AuthService implements AuthServiceBase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) {}
  public async startUserRegister(
    user: UserRegisterDto,
  ): Promise<Pick<JwtTokens, 'refreshToken'>> {
    const userFound = await this.userService.getUser({ email: user.email });
    if (userFound !== null) {
      throw new InternalServerErrorException('This user is already registered');
    }
    const userRegistered: User = await this.userService.startUserRegister(
      user,
      await this.createUserRegistrationToken(user.email),
    );
    return { refreshToken: userRegistered.tokenRegistration };
  }
  public async createUserRegistrationToken(
    email: string,
    options?: JwtSignOptions,
  ): Promise<string> {
    return await this.jwtService.signAsync({ sub: email }, options);
  }
  public validateToken<TResult extends object>(
    token: string,
    options?: JwtVerifyOptions,
  ): TResult {
    return this.jwtService.verify<TResult>(token, options);
  }
  public async validateRegisterToken(token: string): Promise<boolean> {
    const tokenData = this.validateToken<JwtDecodedBase>(token);
    const user: User = await this.userService.getUser({
      email: tokenData.sub,
    });
    if (user === null) {
      throw new NotFoundException(`User not found for that token`);
    }
    return this.cryptoService.isTextSameAsEncrypted(
      token,
      user.tokenRegistration,
    );
  }
}
