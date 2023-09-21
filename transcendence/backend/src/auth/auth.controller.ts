import { Body, Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  auth(): string {
	return ("Log in u stupid bastard (curl -X POST http://localhost:3000/auth/login -d '{\"username\": \"john\", \"password\": \"changeme\"}' -H \"Content-Type: application/json\")");
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}