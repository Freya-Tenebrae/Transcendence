import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards, Request, Param, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/users.service';
import { UserValid } from './UserValid.guard';
import { JwtAuthGuard } from './jwt.guard';
import { Public, clientSecretConstant, clientidConstant } from './constant';
import { ValidateUserDTO } from './DTO/ValidateUser.dto';
import { Admin } from './admin.guard';
import { AdminStrategy } from './admin.strategy';
import { Identity } from './identity.guard';
import { User } from 'src/users/users.decorator';
import { HttpService } from '@nestjs/axios';
import { auth42 } from './42auth.guard';
import { Res } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { get } from 'http';


@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
		private readonly httpService: HttpService
	) { }

	@Get()
	auth(): string {
		return ("Log in u stupid bastard (curl -X POST http://localhost:2000/auth/login -d '{\"username\": \"john\", \"password\": \"changeme\"}' -H \"Content-Type: application/json\")");
	}

	@UseGuards(JwtAuthGuard)
	@Get('loggedstatus')
	async amIlogged(@Body() user: ValidateUserDTO, @Request() req: any): Promise<any> {
		console.log("[auth controller amIlogged] Function called")
		console.log("user id and mail ", req.user)
		return ({ message: "You are logged, buddy !!!!" });
	}

	@Public()
	@UseGuards(UserValid)
	@Post('login')//
	async signIn(@Body() user: ValidateUserDTO): Promise<any> {
		console.log("[auth controller login] Function called with ", user)
		const myUser = await this.userService.user({ email: user.email })
		if (myUser == null)
			return ({error: "No such user."})
		const myPass = await this.userService.pass({ id: myUser.id })
		if (myPass.OTPSecret != null && user.OTP == null)
			return ({ error: "2FA Necessary" })
		console.log("User (should have OTP) ", myUser)
		if (myPass.OTPSecret != null && await this.authService.verifyOTP(myUser, user.OTP) == false)
			return ({ error: "2FA Wrong" })
		const myJWT = await this.authService.signIn(user.email)
		return { id: myUser.id, access_token: myJWT.access_token };
	}
	@Public()
	@Get("auth42")
	async oathcode422(@Query() code): Promise<any> {
		console.log("[auth controller oathcode42]Received this")
		console.log(code)
		if (code?.error != null || !code?.code)
			return (code);
		const myCode = code.code

		var body = {
			'grant_type': 'authorization_code',
			'client_id': 'u-s4t2ud-c6e6bc6e663e516e2041f1a967a53d099a8e63b38c3b89947ec402f0b76971d4',
			'client_secret': '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',
			'code': myCode,
			'redirect_uri': 'https://localhost:2000/auth/callback',
		}
		// body.append('grant_type', 'authorization_code')
		// body.append('client_id', 'u-s4t2ud-c6e6bc6e663e516e2041f1a967a53d099a8e63b38c3b89947ec402f0b76971d4')
		// body.append('client_secret', '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')
		// body.append('code', myCode)
		// body.append('redirect_uri', 'http://localhost:2000/auth/callback')
		const resp42 = await this.httpService.post('https://api.intra.42.fr/oauth/token', body).toPromise()
			.then(res => res.data)
			.catch(err => console.log("============================ nique la ", err)/*handle error*/)
		console.log(body)
		// const resp42 = await this.httpService.post('http://localhost:80/auth/callback', {data: body}).toPromise()
		// 									.then(res => res.data)
		// 									.catch(err => console.log("============================ nique la ", err)/*handle error*/)

		//console.log(resp42)

		////
		return (code)
	}

	@Public()
	@UseGuards(auth42)
	@Get("42")
	async oathcode42(@Query() code): Promise<any> {
		console.log("[auth controller 42]Received this")
		console.log(code)

		console.log("[auth controller 42]If you see this, user should be in db")
		if (code?.error != null || !code?.code)
			return (code);
		const myCode = code.code
		return (code)
	}
	//@Public()
	@UseGuards(auth42)
	@Get("callback")
	async callback42(@Query() code, @Req() req, @Res() res): Promise<any> {
		console.log("[auth controller callback]Received this")
		console.log(code)
		console.log("======================NORMAL VERSION")
		// console.log("================== REQ")
		// console.log(req)
		// console.log("================== REQ")
		// console.log(res)
		const host = req.headers.host.split(':')[0];//pour prendre les urls meme quand c'est pas localhost
		if (code?.error != null || !code?.code) {
			console.log("[auth controller callback]i got nothing")
			return res.redirect(`http://${host}:2002/?error=no_code`);
		}////
		const myPass = await this.userService.pass({ id: Number(req.user.id)})
		const myUser = await this.userService.user({ id: Number(req.user.id)})
		if (!myUser || !myPass) {
			return ({error: "No such id."})
		}
		if (myPass.OTPSecret != null && code.OTP == null) {
			console.log("[auth controller callback] ERREUR, 2FA NEEDED")
			return res.redirect(`http://${host}:2002/?code=${code.code}&error=no2fa&id=${myUser.id}`);
			return ({ error: "2FA Necessary" })
		}
		if (myPass.OTPSecret != null && await this.authService.verifyOTP(myUser, code.OTP) == false) {
			console.log("[auth controller callback] ERREUR, 2FA BAD CODE")
			return res.redirect(`http://${host}:2002/?code=${code.code}&error=bad2fa&id=${myUser.id}`);
			return ({ error: "2FA Wrong" })
		}
		const JWT = await this.authService.giveJWT({ id: myUser.id })
		console.log("[auth controller callback] JWT = ", JWT)
		return res.redirect(`http://${host}:2002/?code=${code.code}&access_token=${JWT}&id=${myUser.id}`);
	}

	@Public()
	@Get("callback-otp")
	async callback42otp(@Query() code, @Req() req, @Res() res): Promise<any> {
		console.log("[auth controller callback-otp]Received this")
		console.log(code)
		console.log("====================== OTP VERSION")
		const host = req.headers.host.split(':')[0];//pour prendre les urls meme quand c'est pas localhost
		if (code?.error != null || !code?.code) {
			console.log("[auth controller callback-otp]i got nothing")
			return res.redirect(`http://${host}:2002/?error=no_code`);
		}
		const myPass = await this.userService.pass({id: Number(code.id)})
		const myUser = await this.userService.user({id: Number(code.id)})
		if (!myUser || !myPass) {
			return ({error: "No such id."})
		}
		console.log("[auth controller callback-otp]my pass is ", myPass)
		if (myPass.OTPSecret != null && code.OTP == null)
		{
			console.log("[auth controller callback-otp] ERREUR, 2FA NEEDED")
			return res.redirect(`http://${host}:2002/?code=${code.code}&error=no2fa&id=${myPass.id}`);
			return ({error: "2FA Necessary"})
		}
		if (myPass.OTPSecret != null && await this.authService.verifyOTP(myUser, code.OTP) == false)
		{
			console.log("[auth controller callback-otp] ERREUR, 2FA BAD CODE")
			return res.redirect(`http://${host}:2002/?code=${code.code}&error=bad2fa&id=${myPass.id}`);
			return ({error: "2FA Wrong"})
		}
		const JWT = await this.authService.giveJWT({id: myPass.id})
		console.log("[auth controller callback-otp] JWT = ", JWT)
		return res.redirect(`http://${host}:2002/?access_token=${JWT}&id=${myPass.id}`);
	}
	//
	//@Public()
	@UseGuards(Admin)
	//@UseGuards(UserValid)
	@Post('test')
	async test(@Body() user: ValidateUserDTO, @User() callerid): Promise<any> {
		console.log("[auth controller test] Function called with ", user)
		console.log("[auth controller test] id is ", callerid)
		console.log("[auth controller test]")
		console.log("[auth controller test]")
		return true;
	}

	@UseGuards(JwtAuthGuard)
	@Get('activate-otp')
	async otp(@User() callerid): Promise<any> {
		console.log("[auth controller otptest ]caller id is ", callerid)
		return (await this.authService.activateOTP(await this.userService.user({ id: callerid })))
	}

	@UseGuards(JwtAuthGuard)
	@Get('otp-verify')
	async otpverify(@Query() code, @User() callerid): Promise<any> {
		console.log("[auth controller otp verify ]caller id is ", callerid)
		console.log("Args are code: ", code)
		return (await this.authService.verifyOTP(await this.userService.user({ id: callerid }), String(code.code)))
	}

	@UseGuards(JwtAuthGuard)
	@Get('deactivate-otp')//
	async deotp(@User() callerid): Promise<any> {
		console.log("[auth controller deotp ]caller id is ", callerid)
		return (await this.authService.deactivateOPT(await this.userService.user({ id: callerid })))
	}

	@UseGuards(JwtAuthGuard)
	@Get('status-otp')//
	async otpquery(@User() callerid): Promise<any> {
		console.log("[auth controller deotp ]caller id is ", callerid)
		const myPass = await this.userService.pass({ id: callerid })
		if (myPass.OTPSecret != null)
			return true
		return false
	}

	@UseGuards(JwtAuthGuard)
	@Get('heartbeat')
	async heartbeat(@User() callerid): Promise<any> {
		await this.authService.beatheart({id: callerid})
		return ({state: "tump tump"})
	}

	@Public()
	@Get('heartcheck')
	async heartcheck(@Query() callerid): Promise<any> {
		const t_diff = await this.authService.checkheart({id: Number(callerid.id)})
		if (t_diff < 5)
			return ({state: "online"})
		if (t_diff < 10)
			return ({state: "away"})
		return ({state: "offline"})
	}
}//