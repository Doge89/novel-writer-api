import { Controller, Body, Post } from '@nestjs/common';

import { AuthService } from './services/auth/auth.service';
import { ValidateRegisterTokenDTO } from './dtos/validate-register-token.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate-register-token')
  public async validateRegisterToken(
    @Body() payload: ValidateRegisterTokenDTO,
  ) {
    return this.authService.validateRegisterToken(payload.tokenRegistration);
  }
}
