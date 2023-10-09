import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async signIn(mail: string, pass: string): Promise<any> {
    const myuser = await this.usersService.user({email: mail});
    if (await this.usersService.checkuserpass(pass, myuser.id) == true) {
		console.log("Failed to sign in")
    	throw new UnauthorizedException();
    }
    //const { password, ...result } = user;
	console.log("[auth sign in] Successful sign in")
    // TODO: Generate a JWT and return it here
    // instead of the user object
    //return result;
  }
}