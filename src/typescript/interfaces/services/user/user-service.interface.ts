import { Prisma, User } from '@prisma/client';
import { UserGetQuery } from '../base/querys.interface';
import {
  UserFinishRegisterDto,
  UserRegisterDto,
} from '../../../../api/v1/user/dtos/user.dto';

export interface UserServiceBase {
  getAllUsers({
    skip,
    take,
    cursor,
    orderBy,
    where,
  }: UserGetQuery): Promise<User[]>;
  getUser(query: Prisma.UserWhereUniqueInput): Promise<User>;
  startUserRegister(
    { email, password }: UserRegisterDto,
    tokenRegistration: string,
  ): Promise<User>;
  registerUser(userDto: UserFinishRegisterDto): Promise<User>;
}
