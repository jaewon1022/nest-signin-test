import {
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

    const isExist = await this.authService.validateUserExist(email);

    if (isExist) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    return request;
  }
}
