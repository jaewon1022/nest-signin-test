import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { users as UserModel } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(@Body() data: CreateUserDto) {
    return this.authService.login(data);
  }

  @Post('register')
  async signupUser(@Body() data: CreateUserDto): Promise<UserModel> {
    return this.authService.register(data);
  }
}
