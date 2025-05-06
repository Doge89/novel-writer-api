import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('mailConfig', () => {
  return {
    mailgunUsername: process.env.MAILGUN_USERNAME,
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
  };
});
