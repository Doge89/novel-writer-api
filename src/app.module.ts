import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/v1/user/user.module';
import { UserController } from './api/v1/user/user.controller';
import { DatabaseManagerModule } from './services/database/database-manager.module';
import { AppRouterModule } from './modules/app-router.module';
import { ValidatorsModule } from './services/validators/validators.module';
import { AuthModule } from './services/auth/auth.module';
import { AuthModule as AuthUserModule } from './api/v1/auth/auth.module';
import { ValidateRegistrationTokenMiddleware } from './middlewares/auth/validate-registration-token/validate-registration-token.middleware';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AuthUserModule,
    DatabaseManagerModule,
    AppRouterModule,
    ValidatorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
