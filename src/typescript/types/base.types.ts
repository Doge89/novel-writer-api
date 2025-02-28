import { $Enums } from '@prisma/client';

export type PrismaEnum<
  TData,
  TKeyEnum extends keyof typeof $Enums,
> = TData extends (typeof $Enums)[TKeyEnum] ? TData : never;

export type PrismaEnumKeys = keyof typeof $Enums;
