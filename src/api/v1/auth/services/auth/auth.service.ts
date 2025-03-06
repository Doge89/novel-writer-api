import { User } from '@prisma/client';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import {
  BadRequestException, forwardRef, Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";

import { UserService } from '../../../user/services/user/user.service';

import { AuthServiceBase } from '../../../../../typescript/interfaces/services/auth/auth.interface';

import { JwtTokens } from '../../../../../typescript/interfaces/models/auth/auth.model';
import { CryptoService } from '../../../../../services/auth/crypto/crypto.service';
import { UserRegisterDto } from '../../../user/dtos/user.dto';
import { DEFAULT_HASH_SIZE } from '../../../../../config/constants';

@Injectable()
export class AuthService implements AuthServiceBase {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
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
      this.createUserRegistrationToken(),
    );
    return { refreshToken: userRegistered.tokenRegistration };
  }
  public createUserRegistrationToken(): string {
    return this.cryptoService.createRandomHash(DEFAULT_HASH_SIZE);
  }
  public validateToken<TResult extends object>(
    token: string,
    options?: JwtVerifyOptions,
  ): TResult {
    return this.jwtService.verify<TResult>(token, options);
  }
  public async validateRegisterToken(token: string): Promise<boolean> {
    const user: User = await this.userService.getFirstUser({
      tokenRegistration: token,
    });
    if (user === null || user === undefined) {
      throw new NotFoundException(`User not found for that token`);
    }
    return user.registrationExpiresAt.valueOf() > Date.now();
  }

  public async refreshUserRegistrationToken(
    token: string,
  ): Promise<Pick<JwtTokens, 'refreshToken'>> {
    const user: User = await this.userService.getFirstUser({
      tokenRegistration: token,
    });
    if (user === null) {
      throw new NotFoundException(`User not found for that token`);
    }
    if (user.registrationExpiresAt.valueOf() > Date.now()) {
      throw new BadRequestException('Token is still valid');
    }
    if (user.isUserValidated) {
      throw new BadRequestException('User is already registered');
    }
    const refreshToken: string = this.createUserRegistrationToken();
    await this.userService.refreshUserTokenRegistration(token, refreshToken);
    return { refreshToken };
  }
}
