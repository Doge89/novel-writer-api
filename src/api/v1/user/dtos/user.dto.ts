import { User } from '@prisma/client';

export type UserRegisterDto = Pick<User, 'email' | 'password'>;
export interface UserFinishRegisterDto
  extends Pick<
    User,
    | 'firstName'
    | 'lastName'
    | 'username'
    | 'isWriter'
    | 'birthDay'
    | 'gender'
    | 'region'
  > {
  interests: string[];
}
