import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user/user.service';
import { PrismaService } from '../../../services/database/prisma/prisma.service';
import { ValidatorsModule } from '../../../services/validators/validators.module';
import { AuthModule } from '../auth/auth.module';
import { AuthModule as AuthServicesModule } from '../../../services/auth/auth.module';
import { ValidateRegistrationTokenMiddleware } from '../../../middlewares/auth/validate-registration-token/validate-registration-token.middleware';
import { EmailModule } from '../../../services/email/email.module';

@Module({
  imports: [ValidatorsModule, AuthServicesModule, AuthModule, EmailModule],
  providers: [PrismaService, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateRegistrationTokenMiddleware)
      .exclude(
        { path: 'user/:id', method: RequestMethod.GET },
        { path: 'user/', method: RequestMethod.GET },
        { path: 'user/start-register', method: RequestMethod.POST },
      )
      .forRoutes(UserController);
  }
}
