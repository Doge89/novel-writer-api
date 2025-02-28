import { User } from '@prisma/client';
import {
  Controller,
  Get,
  Query,
  HttpCode,
  Param,
  Post,
  Body,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';

import { UserService } from './services/user/user.service';
import { AuthService } from '../auth/services/auth/auth.service';

import { UserFinishRegisterDto, UserRegisterDto } from './dtos/user.dto';

import { JwtTokens } from '../../../typescript/interfaces/models/auth/auth.model';

import { UserCanRegisterPipe } from '../../../pipes/auth/user-can-register/user-can-register.pipe';
import {
  ValidateUserRegistrationDtoPipe
} from "../../../pipes/auth/validate-user-registration-dto/validate-user-registration-dto.pipe";

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getUsers(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<User[]> {
    return this.userService.getAllUsers({
      skip,
      take,
    });
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | null> {
    const data: User = await this.userService.getUser({ userId: id });
    console.log(data);
    return this.userService.getUser({ userId: id });
  }
  @Post('start-register')
  @HttpCode(HttpStatus.CREATED)
  public async startUserRegister(
    @Body(UserCanRegisterPipe) userDto: UserRegisterDto,
  ): Promise<Pick<JwtTokens, 'refreshToken'>> {
    return this.authService.startUserRegister(userDto);
  }
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async registerUser(
    @Body(ValidateUserRegistrationDtoPipe) payload: UserFinishRegisterDto,
  ): Promise<any> {
    console.log('Success');
  }
}
