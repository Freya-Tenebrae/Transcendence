import { Strategy } from 'passport-totp';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { clientSecretConstant, clientidConstant } from './constant';
import { AuthService } from './auth.service';

@Injectable()
export class tfa extends PassportStrategy(Strategy, 'tfa') {
  constructor(private AuthService: AuthService) {	
    super({
	  clientID: clientidConstant.secret,
	  clientSecret: clientSecretConstant.secret,
	  callbackURL: 'http://localhost:2000/auth/callback'
    });
  }

  async validate(accessToken, refreshToken, profile, cb): Promise<any> {
	//throw new UnauthorizedException();
    return 1;
  }
}