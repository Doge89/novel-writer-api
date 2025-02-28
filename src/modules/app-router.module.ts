import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { UserModule } from '../api/v1/user/user.module';
import { AuthModule } from '../api/v1/auth/auth.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'user',
        module: UserModule,
      },
      {
        path: 'auth',
        module: AuthModule,
      },
    ]),
  ],
})
export class AppRouterModule {}
