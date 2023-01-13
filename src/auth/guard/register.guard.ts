import {
  BadRequestException,
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class RegisterGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }

  private async validateRequest(request) {
    const { email } = request.body;

    // // 이메일 형식이 맞는지 확인
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // const isEmail = emailRegex.test(email);

    // if (isEmail) {
    const isExist = await this.authService.validateUserExist(email);

    if (isExist) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    // } else {
    //   throw new BadRequestException('이메일 형식이 올바르지 않습니다.');
    // }
    return request;
  }
}
