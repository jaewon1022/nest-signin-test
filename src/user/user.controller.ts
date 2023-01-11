import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { users as UserModel } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<UserModel[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.userService.getUser({ user_id: id });
  }

  @Post()
  async signupUser(@Body() data: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(data);
  }
}
