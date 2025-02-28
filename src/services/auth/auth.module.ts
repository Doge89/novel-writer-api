import { Module } from '@nestjs/common';
import { CryptoService } from './crypto/crypto.service';
import { ValidatorsModule } from '../validators/validators.module';

@Module({
  imports: [ValidatorsModule],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class AuthModule {}
