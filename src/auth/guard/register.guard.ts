import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RegisterGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }

  private async validateRequest(request) {
    const { email } = request.body;
    const prisma = new PrismaService();
    const authService = new AuthService(prisma);

    const isExist = await authService.validateUserExist(email);

    if (isExist) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    return request;
  }
}
