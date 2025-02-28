import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth/auth.service';
import { UserModule } from '../user/user.module';
import { ValidatorsModule } from '../../../services/validators/validators.module';
import { AuthModule as AuthServiceModule } from '../../../services/auth/auth.module';

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
export class AuthModule {}
