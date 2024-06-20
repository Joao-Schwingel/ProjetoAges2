import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User, UserType } from '@prisma/client';
import { IS_ADMIN_KEY, IS_BASIC_KEY } from '../../decorators/role.decorator';
import { IS_PUBLIC_KEY } from '../../decorators/isPublic.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];
    const reflectors = [IS_PUBLIC_KEY, IS_ADMIN_KEY, IS_BASIC_KEY];
    const [isPublic, isAdmin, isBasic] = reflectors.map((reflector) =>
      this.reflector.getAllAndOverride<boolean>(reflector, targets),
    );

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const { userType } = this.jwtService.decode(token) as Pick<
      User,
      'userType'
    >;

    if (userType === UserType.ADMIN && isAdmin) return true;

    if (userType === UserType.BASIC && isBasic) return true;

    throw new UnauthorizedException();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
