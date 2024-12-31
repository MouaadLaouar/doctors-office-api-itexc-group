import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Get required roles for the route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // 2. Get JWT from cookies
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException(
        'No token found you need to be Authenticated',
      );
    }

    try {
      // 3. Verify and decode JWT
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // 4. Check if token is expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        throw new UnauthorizedException('Token has expired');
      }

      // 5. Check if user still exists in database
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User no exists');
      }

      // 6. Check if user has required role
      if (!requiredRoles.includes(decoded.role)) {
        throw new ForbiddenException(
          `User with role ${user.role} does not have access to this resource`,
        );
      }

      // 7. Attach user to request object for later use
      request.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      return true;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }
  }
}
