import {
  BadRequestException,
  ConflictException,
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
import {
  MAILGUN_TEMPLATE_WELCOME_EMAIL,
  MILLISECONDS_IN_DAY,
  URL_FRONTEND_CLIENT,
} from '../../../../../config/constants';
import { MailgunService } from '../../../../../services/email/mailgun/mailgun.service';

@Injectable()
export class UserService implements UserServiceBase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly baseValidatorService: BaseValidatorService,
    private readonly cryptoService: CryptoService,
    private readonly mailGunService: MailgunService,
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

    let username = email.split('@').at(0);
    let user: User;

    while (true) {
      try {
        user = await this.prismaService.user.create({
          data: {
            userUUID: uuidv4(),
            tokenRegistration,
            birthDay: new Date(),
            firstName: '',
            lastName: '',
            username,
            password: await this.cryptoService.encryptString(password, true),
            email,
            gender: 'M',
            region: 'USA',
            registrationExpiresAt: new Date(Date.now() + MILLISECONDS_IN_DAY),
          },
        });
        break;
      } catch (error) {
        if (
          error.code === 'P2002' &&
          (error.meta?.target?.includes('username') ||
            error.meta?.target === 'username')
        ) {
          username = `${email.split('@').at(0)}${Math.floor(
            Math.random() * 10000,
          )}`;
        } else {
          throw error;
        }
      }
    }

    this.mailGunService.setTemplate(MAILGUN_TEMPLATE_WELCOME_EMAIL);
    this.mailGunService.setVariables({
      link: `${URL_FRONTEND_CLIENT}/signup/${tokenRegistration}`,
      username,
    });
    this.mailGunService.setTo(email);
    await this.mailGunService.send();
    return user;
  }

  public async registerUser(
    tokenRegistration: string,
    userDto: UserFinishRegisterDto,
  ): Promise<User> {
    const user: User = await this.getFirstUser({
      tokenRegistration,
    });
    if (!user) {
      throw new NotFoundException('User has not begun the registration');
    }
    if (user.isUserValidated) {
      throw new InternalServerErrorException('User already validated');
    }
    const existingUser = await this.getFirstUser({
      username: userDto.username,
    });
    if (existingUser && existingUser.userId !== user.userId) {
      throw new ConflictException('User already exists with that username');
    }

    const { interests, ...userData } = userDto;

    return this.prismaService.user.update({
      where: { email: user.email },
      data: {
        ...userData,
        isUserValidated: true,
      },
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
