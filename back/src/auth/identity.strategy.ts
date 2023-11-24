import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

@Injectable()
export class IdentityStrategy extends PassportStrategy(Strategy, 'identity') {
  constructor(private AuthService: AuthService) {
    super({
	  usernameField: 'id'
    });
  }

  async validate(id: number, ctx: ExecutionContext) {
	const req = ctx.switchToHttp().getRequest();
	const callerid = req.user.Userid;
	console.log("[Identity strategy validate] id is ", id)
	console.log("[Identity strategy validate] callerid is ", callerid)
    return { id };
  }
}//


