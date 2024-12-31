import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private setCookieWithJwtToken(
    response: Response,
    userId: string,
    email: string,
    role: UserRole,
  ) {
    const token = this.jwtService.sign({
      sub: userId,
      email,
      role,
    });

    response.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return token;
  }

  async SignUp(Dto: SignUpDto, response: Response) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: Dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(Dto.password, salt);

    // Create user with role-specific profile
    const user = await this.prisma.user.create({
      data: {
        email: Dto.email,
        password: hashedPassword,
        role: Dto.role,
      },
    });

    switch (Dto.role) {
      case UserRole.DOCTOR:
        await this.prisma.doctor.create({
          data: {
            name: Dto.name,
            specialization: Dto.specialization,
            userId: user.id,
          },
        });
        break;
      case UserRole.ADMIN:
        await this.prisma.admin.create({
          data: {
            name: Dto.name,
            userId: user.id,
          },
        });
        break;
      case UserRole.PATIENT:
        await this.prisma.patient.create({
          data: {
            name: Dto.name,
            dateOfBirth: new Date(Dto.dateOfBirth),
            address: Dto.address,
            userId: user.id,
          },
        });
        break;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const token = this.setCookieWithJwtToken(
      response,
      user.id,
      user.email,
      user.role,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async SignIn(Dto: SignInDto, response: Response) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: Dto.Email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(Dto.Password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Set JWT in cookie
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const token = this.setCookieWithJwtToken(
      response,
      user.id,
      user.email,
      user.role,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async SignOut(response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'strict',
    });

    return {
      message: 'Logged out successfully',
    };
  }
}
