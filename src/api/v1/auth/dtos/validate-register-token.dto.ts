import { User } from '@prisma/client';

export type ValidateRegisterTokenDTO = Pick<User, 'tokenRegistration'>;
