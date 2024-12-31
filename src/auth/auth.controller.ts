import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  SignIn(
    @Body() SignInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.SignIn(SignInDto, response);
  }

  @Post('sign-up')
  SignUp(
    @Body() SignUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.SignUp(SignUpDto, response);
  }

  @Post('sign-out')
  SignOut(@Res({ passthrough: true }) response: Response) {
    return this.authService.SignOut(response);
  }
}
