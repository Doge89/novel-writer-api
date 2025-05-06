import { $Enums } from '@prisma/client';
import Mailgun from 'mailgun.js';

export type PrismaEnum<
  TData,
  TKeyEnum extends keyof typeof $Enums,
> = TData extends (typeof $Enums)[TKeyEnum] ? TData : never;

export type PrismaEnumKeys = keyof typeof $Enums;

export type ProjectEnvironments = 'dev' | 'prod' | 'quality';

export type EnvironmentFiles = Record<ProjectEnvironments, string>;

export type MailgunClient = ReturnType<InstanceType<typeof Mailgun>['client']>;
