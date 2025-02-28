import { Prisma } from '@prisma/client';

export interface GetQueryBase {
  skip?: number;
  take?: number;
}

export interface UserGetQuery extends GetQueryBase {
  cursor?: Prisma.UserWhereUniqueInput;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}
