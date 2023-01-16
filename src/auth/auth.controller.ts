import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
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
}
