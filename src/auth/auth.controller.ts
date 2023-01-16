import {
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { User as UserModel } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { RegisterGuard } from './guard/register.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async loginUser(@Body() data: CreateUserDto) {
    return this.authService.login(data);
  }

  @UseGuards(RegisterGuard)
  @Post('register')
  async signupUser(@Body() data: CreateUserDto): Promise<UserModel> {
    return this.authService.register(data);
  }

  @Post('send-code')
  sendVerificationCode(email: string): Promise<string> {
    return this.authService.sendVerifyCode(email);
  }

  @Post('email-verify')
  async verifyEmail(@Query() signupToken: string): Promise<string> {
    return await this.authService.verifyEmail(signupToken);
  }
}
