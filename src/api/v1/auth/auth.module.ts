import {
  Module,
  forwardRef,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth/auth.service';
import { UserModule } from '../user/user.module';
import { ValidatorsModule } from '../../../services/validators/validators.module';
import { AuthModule as AuthServiceModule } from '../../../services/auth/auth.module';
import { InvalidateTokenRegistrationMiddleware } from '../../../middlewares/auth/invalidate-token-registration/invalidate-token-registration.middleware';

@Module({
  imports: [
    forwardRef(() => UserModule),
    ValidatorsModule,
    AuthServiceModule,
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(InvalidateTokenRegistrationMiddleware).forRoutes({
      path: 'auth/register-token',
      method: RequestMethod.PATCH,
    });
  }
}
