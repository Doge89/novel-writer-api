import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { BaseValidatorService } from '../../../services/validators/base-validator/base-validator.service';
import { AuthService } from '../../../api/v1/auth/services/auth/auth.service';

@Injectable()
export class ValidateRegistrationTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly baseValidatorService: BaseValidatorService,
    private readonly authService: AuthService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { tokenRegistration } = req.params;
    if (
      !this.baseValidatorService.isValidString(tokenRegistration, {
        ignoreWhitespace: true,
      })
    )
      throw new UnauthorizedException('Token is missing');
    this.authService
      .validateRegisterToken(tokenRegistration)
      .then((isValid) => {
        if (!isValid) throw new UnauthorizedException('Token is invalid');
        next();
      })
      .catch((error) => {
        next(error);
      });
  }
}
