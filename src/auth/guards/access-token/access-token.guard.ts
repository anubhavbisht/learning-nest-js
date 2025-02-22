import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constant';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payload = this.jwtService.verifyAsync(token, this.jwtConfiguration);
      request[REQUEST_USER_KEY] = payload;
    } catch (e) {
      console.error(e, 'Error in jwt guard');
      throw new UnauthorizedException('Token not validated');
    }
    return true;
  }

  private getTokenFromRequest(request: Request) {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
