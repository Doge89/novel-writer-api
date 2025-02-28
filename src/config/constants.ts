import { Prisma } from '@prisma/client';

export const USER_TEMPLATE: Prisma.UserUncheckedCreateInput = {
  userId: NaN,
  userUUID: '',
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  birthDay: new Date(),
  gender: 'F',
  region: 'Mexico',
  isUserValidated: false,
  tokenRegistration: '',
  isWriter: false,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  registrationExpiresAt: new Date(),
};

export const MIN_PASSWORD_LENGTH = 8;

export const STRING_CONTAINS_SPECIAL_CHARACTERS = new RegExp(/[&@#$=+:;><?]/i);
export const STRING_IS_ALPHANUMERIC = new RegExp(
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*/,
);

export const IS_STRING_VALID_EMAIL = new RegExp(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
);

export const DEFAULT_HASH_SIZE = 32;
export const MILLISECONDS_IN_DAY = 86_400_000;
