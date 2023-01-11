import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { users as UserModel } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser({ user_id: id });
  }

  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() data: UpdateUserDto) {
    return this.userService.updatePassword({
      where: { user_id: id },
      data,
    });
  }
}
