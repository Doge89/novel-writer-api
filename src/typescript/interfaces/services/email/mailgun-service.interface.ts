import { MailgunMessageData } from 'mailgun.js/definitions';
import { MailBase } from './mail-base.interface';
import { MailgunClient } from '../../../types/base.types';

export abstract class MailgunServiceBase implements MailBase<any> {
  protected _mailgunClient: MailgunClient;
  protected messageData: MailgunMessageData;
  abstract send(): Promise<void>;
  abstract setTo(to: string | string[]): void;
  abstract setCc(cc: string | string[]): void;
  abstract setBcc(bcc: string | string[]): void;
  abstract setFrom(from: string): void;
  abstract setSubject(subject: string): void;
  abstract setTemplate(template: string): void;
  abstract setVariables(vars: Record<string, any>): void;
}
