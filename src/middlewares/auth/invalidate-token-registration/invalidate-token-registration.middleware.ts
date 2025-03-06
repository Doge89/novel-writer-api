import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../api/v1/auth/services/auth/auth.service';
import { BaseValidatorService } from '../../../services/validators/base-validator/base-validator.service';

@Injectable()
export class InvalidateTokenRegistrationMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly baseValidatorService: BaseValidatorService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { tokenRegistration } = req.body;
    if (typeof tokenRegistration !== 'string') {
      next(new BadRequestException('Invalid value for a token'));
    }
    if (!this.baseValidatorService.isValidString(tokenRegistration)) {
      next(new BadRequestException('Content from a token is invalid'));
    }
    this.authService
      .validateRegisterToken(tokenRegistration)
      .then((isValid) => {
        if (isValid) throw new ForbiddenException('Token is valid');
        next();
      })
      .catch((err) => {
        next(err);
      });
  }
}
