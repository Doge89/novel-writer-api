import { Controller, Body, Post, Patch } from '@nestjs/common';

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

  @Patch('register-token')
  public async updateRegisterToken(@Body() payload: ValidateRegisterTokenDTO) {
    return this.authService.refreshUserRegistrationToken(
      payload.tokenRegistration,
    );
  }
}
