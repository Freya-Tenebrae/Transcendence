import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstant } from './constant';
import { AuthService } from './auth.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private AuthService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.secret,
	  usernameField: 'id'
    });
  }

  async validate(payload: any) {
	if (await this.AuthService.verifyAdmin({id: payload.id}) ==  false)
	{
		console.log("[admin strategy validate] not an admin")
		throw new UnauthorizedException();
	}
	//console.log("[admin strategy validate] dumping payload ", payload)
	// console.log("[admin strategy validate]")
	console.log("[admin strategy validate] admin checked")
	//console.log("[admin strategy validate] I just detected ", payload.id, " and ", payload.email, " and ", id)
    return { userId: payload.id, email: payload.email };
  }
}//