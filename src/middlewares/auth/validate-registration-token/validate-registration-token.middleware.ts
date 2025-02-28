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
    const { registerToken } = req.params;
    const decodedToken = decodeURIComponent(registerToken);
    if (
      !this.baseValidatorService.isValidString(decodedToken, {
        ignoreWhitespace: true,
      })
    )
      throw new UnauthorizedException('Token is missing');
    this.authService
      .validateRegisterToken(decodedToken)
      .then(() => {
        next();
      })
      .catch((error) => {
        next(new UnauthorizedException(error.message));
      });
  }
}
