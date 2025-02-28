import { BadRequestException, Injectable } from '@nestjs/common';
import { $Enums, Prisma, User } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../../../../../services/database/prisma/prisma.service';
import { UserGetQuery } from '../../../../../typescript/interfaces/services/base/querys.interface';
import { UserServiceBase } from '../../../../../typescript/interfaces/services/user/user-service.interface';

import { UserFinishRegisterDto, UserRegisterDto } from '../../dtos/user.dto';
import { CryptoService } from '../../../../../services/auth/crypto/crypto.service';
import { BaseValidatorService } from '../../../../../services/validators/base-validator/base-validator.service';
import { MILLISECONDS_IN_DAY } from "../../../../../config/constants";
@Injectable()
export class UserService implements UserServiceBase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly baseValidatorService: BaseValidatorService,
    private readonly cryptoService: CryptoService,
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
  public async registerUser(userDto: UserFinishRegisterDto): Promise<User> {
    return this.prismaService.user.update({
      where: { userId: 1 },
      data: userDto,
    });
  }
}
