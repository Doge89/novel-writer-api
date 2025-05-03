import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../../../../../services/database/prisma/prisma.service';
import { UserGetQuery } from '../../../../../typescript/interfaces/services/base/querys.interface';
import { UserServiceBase } from '../../../../../typescript/interfaces/services/user/user-service.interface';

import { UserFinishRegisterDto, UserRegisterDto } from '../../dtos/user.dto';
import { CryptoService } from '../../../../../services/auth/crypto/crypto.service';
import { BaseValidatorService } from '../../../../../services/validators/base-validator/base-validator.service';
import { MILLISECONDS_IN_DAY } from '../../../../../config/constants';
import { AuthService } from '../../../auth/services/auth/auth.service';
@Injectable()
export class UserService implements UserServiceBase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly baseValidatorService: BaseValidatorService,
    private readonly cryptoService: CryptoService,
    private readonly authService: AuthService,
  ) {}

  public async getAllUsers({
    skip,
    take,
    where,
    cursor,
    orderBy,
  }: UserGetQuery): Promise<User[]> {
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  public async getUser(
    query: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: query,
    });
  }

  public async getFirstUser(
    query: Prisma.UserWhereInput,
  ): Promise<User | null> {
    return (
      await this.prismaService.user.findMany({
        where: query,
      })
    ).at(0);
  }

  public async startUserRegister(
    { email, password }: UserRegisterDto,
    tokenRegistration: string,
  ): Promise<User> {
    if (!this.baseValidatorService.isValidPassword(password)) {
      throw new BadRequestException('User cannot register');
    }
    console.log(tokenRegistration);
    return this.prismaService.user.create({
      data: {
        userUUID: uuidv4(),
        tokenRegistration,
        birthDay: new Date(),
        firstName: '',
        lastName: '',
        username: email.split('@').at(0),
        password: await this.cryptoService.encryptString(password, true),
        email,
        gender: 'M',
        region: 'USA',
        registrationExpiresAt: new Date(Date.now() + MILLISECONDS_IN_DAY),
      },
    });
  }

  public async registerUser(
    tokenRegistration: string,
    userDto: UserFinishRegisterDto,
  ): Promise<User> {
    const user: User = await this.getFirstUser({
      tokenRegistration,
    });
    if (user === null || user === undefined) {
      throw new NotFoundException('User has not begun the registration');
    }
    if (user.isUserValidated) {
      throw new InternalServerErrorException('User already validated');
    }
    if ((await this.getFirstUser({ username: userDto.username })) !== null) {
      throw new InternalServerErrorException(
        'User already exists with that username',
      );
    }
    return this.prismaService.user.update({
      where: { email: user.email },
      data: userDto,
    });
  }

  public async refreshUserTokenRegistration(
    oldToken: string,
    newToken: string,
  ): Promise<User> {
    const { email }: User = await this.getFirstUser({
      tokenRegistration: oldToken,
    });
    return this.prismaService.user.update({
      where: { email },
      data: {
        tokenRegistration: newToken,
        registrationExpiresAt: new Date(Date.now() + MILLISECONDS_IN_DAY),
        updatedAt: new Date(Date.now()),
      },
    });
  }
}
