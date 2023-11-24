import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/api/DTO/CreateUser.dto';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode'
import { QRCode } from 'qrcode';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UserService,
		private jwtService: JwtService,
	) { }
	////
	async activateOTP(user: CreateUserDTO): Promise<any> {
		console.log("[auth service activateOTP]")
		const secret = authenticator.generateSecret()
		const token = authenticator.generate(secret)
		this.usersService.updatePass({
			data: {
				OTPSecret: secret,
				OTPToken: token,
			},
			where: { id: user.id }
		})
		const otpauth = authenticator.keyuri(user.email, "Transcendence Cyberpong", secret)
		var img
		img = qrcode.toDataURL(otpauth)
		const txt = qrcode.toString(otpauth)
		console.log("[Biotifel ASCII QR coade]  \n", await txt)
		return { secret: secret, img: await img }
	}

	async deactivateOPT(user: CreateUserDTO): Promise<any> {
		return (this.usersService.updatePass({
			data: {
				OTPSecret: null,
				OTPToken: null,
			},
			where: { id: user.id }
		}) != null)
	}

	async verifyOTP(user: CreateUserDTO, token: string): Promise<any> {
		console.log("[auth service verifyOTP] called with ", user, " and ", token)
		const myPass = await this.usersService.pass({ id: user.id })
		const result = await authenticator.verify({ token: token, secret: myPass.OTPSecret })
		console.log("[auth service verifyOTP] result is ", result)
		return result
	}

	async validUserPW(mail: string, pass: string): Promise<any> {
		console.log("[auth service validUser] function call with mail ", mail, " pass ", pass)
		const myuser = await this.usersService.user({ email: mail });
		if (!myuser) {
			console.log("Failed to sign in because bad user")
			return (null);
		}
		//pass = await this.saltstring(pass, myuser)
		const mypass = await this.usersService.IdGetPass(myuser.id);
		const ismatch = await bcrypt.compare(pass, mypass.salted_password);
		const ismatch2 = mypass.salted_password == pass ? "same" : "diff"
		console.log("Ismatch = ", ismatch, " And Ismatch2 = ", ismatch2)
		//const ismatch = await bcrypt.compare(pass, mypass.salt, null);
		//console.log("[validuserpw] It looks like the password match between ", pass, "and the salt gives ", ismatch);
		//console.log("[validuserpw] It looks like the password match between ", mypass.salted_password, "and the salt gives ", ismatch);
		//console.log("My user is ", myuser)
		if (myuser && ismatch != true) {
			//	if (myuser && await this.usersService.checkuserpass(pass, myuser?.id) != true) {
			console.log("Failed to sign in because bad password")
			return (null);
		}
		return myuser;
	}


	async makeorret(user: CreateUserDTO): Promise<User> {
		var myuser = await this.usersService.user({ email: user.email })
		if (!myuser) {
			while ((await this.usersService.user({ nickname: user.nickname })))
			{
				user.nickname = user.nickname + "_Was_Taken"
			}
			myuser = await this.usersService.createUser(user as any)
		}
		return (myuser)
	}
	async signIn(user: any): Promise<any> {

		console.log("[auth service sign in called with params ", user)
		const OurUser = await this.usersService.fuser(user);
		console.log("[auth service sign in] signin in user ", OurUser);
		if (OurUser) {
			console.log("[auth sign in] sign in successful");
			const JWT = { email: OurUser.email, id: OurUser.id };
			return { access_token: this.jwtService.sign(JWT) };
		}
		console.log("[auth sign in] sign in failed")
		return ({ content: "Go fuck yourself" });
	}

	async giveJWT(user: any): Promise<any> {
		const OurUser = await this.usersService.user(user);
		const JWT = { email: OurUser.email, id: OurUser.id };
		return this.jwtService.sign(JWT);
	}

	async makepass(password: string): Promise<any> {
		const saltRounds = 10; // Number of salt rounds (cost factor)
		const salt = bcrypt.genSaltSync(saltRounds); // Generate a salt
		const salted_pass = bcrypt.hashSync(password, salt);
		return { salted_password: salted_pass, salt: salt }
	}

	async saltstring(password: string, user: CreateUserDTO): Promise<any> {
		const myUser = await this.usersService.user(user as any)
		const salt = (await this.usersService.IdGetPass(myUser.id)).salt
		return (bcrypt.hashSync(password, salt))
	}

	async verifyAdmin(user: CreateUserDTO): Promise<boolean> {
		const myuser = await this.usersService.user(user as any);
		if (myuser?.admin == 1)
			return (true);
		console.log("[auth service verifyAdmin] user not verified as admin")
		return (false);
	}

	async verifyadminorsame(user: CreateUserDTO, id: number): Promise<boolean> {
		const myuser = await this.usersService.user({ id: id });
		if (myuser?.admin != 1) {
			if (myuser?.id != user.id) {
				console.log("[Auth service verifyadminorsame] different user and not admin")
				return (false);
			}
			console.log("[Auth service verifyadminorsame] checked as same user")
			return (true);
		}
		console.log("[Auth service verifyadminorsame] checked as admin")
		return (true);
	}

	async verifysame(user: CreateUserDTO, id: number): Promise<boolean> {
		if (user.id != id) {
			console.log("[Auth service verifysame] different user and not admin")
			return (false);
		}
		//console.log("[Auth service verifysame] checked as same user")
		return (true);
	}

	async beatheart(user: CreateUserDTO): Promise<any> {
		var myUser = await this.usersService.user({id: user.id})
		myUser.heartbeat = new Date()
		if (myUser)
		{
			await this.usersService.updateUser({
				where: {
					id: user.id,
				},
				data: (myUser as any),
			})
		}
	}

	async checkheart(user: CreateUserDTO): Promise<any> {
		var myUser = await this.usersService.user({id: user.id})
		const now = new Date()
		const diff = (now.getTime() - myUser.heartbeat.getTime())/60000
		console.log("Inscription date ", myUser.heartbeat)
		console.log("The date is ", now)
		console.log("The diff is ", diff)
		return (diff)
	}
}

//test
