import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  auth(): string {
	return ("Log in u stupid bastard (curl -X POST http://localhost:2000/auth/login -d '{\"username\": \"john\", \"password\": \"changeme\"}' -H \"Content-Type: application/json\")");
  }

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() user: {email: string, password: string}): Promise<any> {
	console.log("[auth controller login] Function called")
    return this.authService.signIn(user.email);
  }
}