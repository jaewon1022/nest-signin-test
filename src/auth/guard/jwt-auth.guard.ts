import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  //   canActivate(
  //     context: ExecutionContext,
  //   ): boolean | Promise<boolean> | Observable<boolean> {
  //     const request = context.switchToHttp().getRequest();
  //     return this.validateRequest(request);
  //   }
  //   private validateRequest(request: any) {
  //     const AccessToken = request.headers.authorization.split('Bearer ')[1];
  //     try {
  //       jwt.verify(AccessToken, process.env.JWT_SECRET);
  //       return true;
  //     } catch (error) {
  //       //   console.log('error : ', error);
  //       // error Uncaught TokenExpiredError
  //       throw new UnauthorizedException('인증 토큰이 만료되었습니다.');
  //     }
  //   }
}
