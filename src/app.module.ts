import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/v1/user/user.module';
import { DatabaseManagerModule } from './services/database/database-manager.module';
import { AppRouterModule } from './modules/app-router.module';
import { ValidatorsModule } from './services/validators/validators.module';
import { AuthModule } from './services/auth/auth.module';
import { AuthModule as AuthUserModule } from './api/v1/auth/auth.module';

import secrets from './config/secrets.config';
import mailConfig from './config/mail.config';
import { ENVIRONMENTS } from './config/environments';
import { EmailModule } from './services/email/email.module';
import { TagModule } from './api/v1/tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENVIRONMENTS[process.env.NODE_ENV || 'development'],
      load: [secrets, mailConfig],
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    AuthUserModule,
    DatabaseManagerModule,
    AppRouterModule,
    ValidatorsModule,
    EmailModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
