import { Injectable, UnauthorizedException} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
	private usersService: UserService,
	private jwtService: JwtService
	) {}

  async validUserPW(mail: string, pass: string): Promise<any> {
    const myuser =  await this.usersService.user({email: mail});
	console.log("[auth service validUser] function call")
	if (await this.usersService.checkuserpass(pass, myuser?.id) == true) {
		console.log("Failed to sign in")
		return (null);
	}
	return myuser;
  }

  async signIn(user: any): Promise<any> {
    
	const JWT = { email: user.email, id: user.id};
	return {access_token: this.jwtService.sign(JWT)};

  }
}

//test