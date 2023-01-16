import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { NonPWUser } from 'src/@types/user';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<NonPWUser[]> {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Headers() headers: any, @Body('email') email: string) {
    return this.userService.getUser(email);
  }

  @Delete('remove/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser({ user_id: id });
  }

  @Patch('update/:id')
  async updateUser(@Param('id') id: number, @Body() data: UpdateUserDto) {
    return this.userService.updatePassword({
      where: { user_id: id },
      data,
    });
  }
}
