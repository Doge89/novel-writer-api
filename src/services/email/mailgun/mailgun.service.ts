import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import * as FormData from 'form-data';

import mailConfig from '../../../config/mail.config';
import { MailgunServiceBase } from '../../../typescript/interfaces/services/email/mailgun-service.interface';
import { MESSAGE_TEMPLATE } from '../../../config/constants';
import { BaseValidatorService } from '../../validators/base-validator/base-validator.service';

@Injectable()
export class MailgunService extends MailgunServiceBase {
  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailConfigService: ConfigType<typeof mailConfig>,
    private readonly baseValidatorService: BaseValidatorService,
  ) {
    super();
    const formData = new Mailgun(FormData);
    this._mailgunClient = formData.client({
      username: this.mailConfigService.mailgunUsername,
      key: this.mailConfigService.mailgunApiKey,
    });
    this.messageData = MESSAGE_TEMPLATE;
  }

  public async send(): Promise<void> {
    this._mailgunClient.messages
      .create(this.mailConfigService.mailgunDomain, this.messageData)
      .then((response) => {
        console.log(this.messageData);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.messageData = MESSAGE_TEMPLATE;
      });
  }

  public setTo(to: string | string[]): void {
    if (to instanceof Array) {
      if (
        !to.every((email) => this.baseValidatorService.isValidString(email))
      ) {
        throw new Error('All the emails must be valid');
      }
    } else {
      if (
        !this.baseValidatorService.isValidString(to, {
          ignoreWhitespace: false,
        })
      ) {
        throw new Error('The email must be valid');
      }
    }
    this.messageData.to = to;
  }
  public setCc(cc: string | string[]): void {
    throw new Error('Method not implemented.');
  }
  public setBcc(bcc: string | string[]): void {
    throw new Error('Method not implemented.');
  }
  public setFrom(from: string): void {
    throw new Error('Method not implemented.');
  }
  public setSubject(subject: string): void {
    throw new Error('Method not implemented.');
  }
  public setTemplate(template: string): void {
    if (
      !this.baseValidatorService.isValidString(template, {
        ignoreWhitespace: false,
      })
    ) {
      throw new Error('Invalid template name');
    }
    this.messageData.template = template;
  }
  public setVariables(vars: Record<string, any>): void {
    this.messageData['h:X-Mailgun-Variables'] = vars;
  }
}
