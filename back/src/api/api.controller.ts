import { Controller, Get, Post, Body, Put, HttpCode, HttpStatus, Param, UseGuards} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from '../users/users.service';
import { Public } from '../auth/constant';
import { CreateUserDTO, SearchDTO } from './DTO/CreateUser.dto';
import { User } from 'src/users/users.decorator';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

//import { }

@Controller('api')
export class ApiController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
		) {}

	@Get()
	getReqform(): string {
		return ("To send an API req: curl -X POST http://localhost:2000/auth/login -d '{\"username\": \"john\", \"password\": \"changeme\"}' -H \"Content-Type: application/json\"");
	// curl -X POST http://localhost:2000/auth/login -d '{"username": "john", "password": "changemel"}' -H "Content-Type: application/json"
}

// ============== USERS
// Rappel
// model User {
// 	id		Int     @default(autoincrement()) @id
// 	email		String  @unique
// 	password  String?
// 	admin		Int		@default(0)
//   }

	@Public()
	@Get('user/id/:id')
	async findUserbyID(@Param('id') id:string): Promise<UserModel>{
		//console.log("[api controller user/:id]Returning user by id ", id);
		return this.userService.user({id : Number(id)})
	}

	@Public()
	@Get('user/id')
	async findUserbyIDr(@Body() userData: CreateUserDTO): Promise<UserModel>{
		console.log("[api controller user/id req]Returning user requested as ", userData);
		return this.userService.user(userData as any)
	}

	@Public()
	@Get('user/mail/:mail')
	async findUserbyMail(@Param('mail') mail:string): Promise<UserModel>{
		console.log("[api controller user/:mail]Returning user by mail ", mail);
		return this.userService.user({email : String(mail)})
	}

	@Public()
	@Get('user/mail')
	async findUserbyMailr(@Body() userData: {email: string}): Promise<UserModel>{
		console.log("[api controller user/mail req]Returning user requested as ", userData);
		return this.userService.user(userData)
	}

	@Public()
	@Get('user')
	async findUserr(@Body() userData: CreateUserDTO): Promise<UserModel>{
		console.log("[api controller user req]Returning user requested as ", userData);
		return this.userService.user(userData as any)
	}

	@Public()
	@Get('users')
	async findUsers(): Promise<UserModel[]> {
		return this.userService.users({
			orderBy: {id: 'desc'}
		});
	}

	@Public()
	@Get('leaderboard')
	async leaderboard(@Body() body): Promise<UserModel[]> {
		console.log("[api controller leaderboard] top is ", body.top)
		if (!body?.top)
			body.top = 10
		return this.userService.users({
			orderBy: {elo: 'desc'},
			take: body.top
		});
	}
//
	@Public()
	@Get('leaderboard/:top')
	async leaderboard2(@Param('top') top:string): Promise<UserModel[]> {
		console.log("[api controller leaderboard2] top is ", top)
		var bing = 0
		if (!top)
			bing = 10
		else
			bing = Number(top)
		return this.userService.users({
			orderBy: {elo: 'desc'},
			take: bing
		});
	}

	@Public()
	@Get('users/:searchstring/:sort/:asc')
	async SearchallUsers(@Param('searchstring') searchstring: string, @Param('sort') sort: string, @Param('asc') asc: string): Promise<UserModel[]> {
		if (sort != null && (asc == "asc" || asc == "desc"))
		{
			console.log("Sort is ", sort, " and asc is ", asc)
			const sort2 = {[sort]: asc}
			console.log("sort2 is ", sort2)
			return this.userService.users({
				where: {
					OR: [
						{
							email: {contains: searchstring}
						},
						{
							name: {contains: searchstring}
						},
						{
							surname: {contains: searchstring}
						},
						{
							nickname: {contains: searchstring}
						},					
					]
				},
				orderBy: (sort2 as any)
			});
		}
		return this.userService.users({
			where: {
				OR: [
					{
						email: {contains: searchstring}
					},
					{
						name: {contains: searchstring}
					},
					{
						surname: {contains: searchstring}
					},
					{
						nickname: {contains: searchstring}
					},					
				]
			}
		});
	}

	@Public()
	@Get('users/:field/:searchstring/:sort/:asc')
	async SearchUsers(@Param('field') field: string, @Param('searchstring') searchstring: string, @Param('sort') sort: string, @Param('asc') asc: string): Promise<UserModel[]> {
		if (field == null)
			return(this.SearchallUsers(searchstring, sort, asc))
		if (sort != null && (asc == "asc" || asc == "desc"))
		{
			const sort2 = {[sort]: asc}
			return this.userService.users({
				where: {
					[field]: {contains: searchstring}
				},
				orderBy: (sort2 as any)
			});
		}
		return this.userService.users({
			where: {
				[field]: {contains: searchstring}
			}
		});
	}

	@Public()
	@Get('users/searchall')
	async SearchUsers2(@Body() data: SearchDTO): Promise<UserModel[]> {
		const searchstring = data.searchstring
		const sort = data.sort
		const asc = data.asc
		console.log("We got called with searchstring ", searchstring)
		if (sort != null && (asc == "asc" || asc == "desc"))
		{
			console.log("Sort is ", sort, " and asc is ", asc)
			const sort2 = {[sort]: asc}
			console.log("sort2 is ", sort2)
			return this.userService.users({
				where: {
					OR: [
						{
							email: {contains: searchstring}
						},
						{
							name: {contains: searchstring}
						},
						{
							surname: {contains: searchstring}
						},
						{
							nickname: {contains: searchstring}
						},					
					]
				},
				orderBy: (sort2 as any)
			});
		}
		return this.userService.users({
			where: {
				OR: [
					{
						email: {contains: searchstring}
					},
					{
						name: {contains: searchstring}
					},
					{
						surname: {contains: searchstring}
					},
					{
						nickname: {contains: searchstring}
					},					
				]
			}
		});
	}

	@Public()
	@Get('users/search')
	async SearchUsers3(@Body() data: SearchDTO): Promise<UserModel[]> {
		const searchstring = data.searchstring
		const sort = data.sort
		const asc = data.asc
		const field = data.field
		if (field == null)
			return(this.SearchUsers2(data))
		console.log("We got called with searchstring ", searchstring)
		if (sort != null && (asc == "asc" || asc == "desc"))
		{
			console.log("Sort is ", sort, " and asc is ", asc)
			const sort2 = {[sort]: asc}
			console.log("sort2 is ", sort2)
			return this.userService.users({
				where: {
					[field]: {contains: searchstring}
				},
				orderBy: (sort2 as any)
			});
		}
		return this.userService.users({
			where: {
				[field]: {contains: searchstring}
			}
		});
	}


	@Public()
	@Get('admins')
	async findAdmins(): Promise<UserModel[]> {
		return this.userService.users({
			where: {admin: 1}
		});
	}
  

	// @Get('user/:data')
	// async findUser(@Param('data') data): Promise<UserModel | string>{
	// 	console.log("[api controller user]Returning user requested as ", data);
	// 	try {
	// 		if (this.userService.user({email: String(data)}) != this.userService.user({id: -1}))
	// 			return this.userService.user({email: String(data)})
	// 	}
	// 	catch {
	// 		console.log("[api controller user] Didn't find it in emails")
	// 	}
	// 	console.log("========================")
	// 	try {
	// 		if (this.userService.user({id: Number(data)}) != null)
	// 			return this.userService.user({id: Number(data)})
	// 	}
	// 	catch {
	// 		console.log("[api controller user] Didn't find it in Ids")
	// 	}
	// 	return ("User was not found, go fuck urself")
	// }

	//@HttpCode(HttpStatus.OK)
	@Public()
	@Post('user')
	async newUser(
	  @Body() userData: CreateUserDTO,
	): Promise<UserModel> {
	  console.log("New user sign up");
	  if (userData.password && userData.password.oAuth42Link == null)
	  {
		userData.password = { create: await this.authService.makepass(userData.password.salted_password)} as any
		console.log("Du coup makepass est ", userData.password)
	  }
	  return this.userService.createUser(userData as any);
	}
//
	@UseGuards(JwtAuthGuard)
	@Put('chuser')
	async modifyUser(@Body() userdata: CreateUserDTO, @User() CallerId: number):
		Promise<UserModel> {
			if (userdata.id && await this.authService.verifyadminorsame(userdata, CallerId) == false)
			{
				console.log("[api controller chuser] userdata: ", userdata, " callerid: ", CallerId)
				return({message: "Intruder !!!"} as any)
			}
			userdata.id = CallerId
			userdata.admin = await (await this.userService.fuser(CallerId)).admin
			console.log("[Put user] modifying user request: ", userdata);
			return await this.userService.updateUser({
				where: {id: userdata.id},
				data: (userdata as any),
				})
		}//

	@UseGuards(JwtAuthGuard)
	@Put('chme')
	async modifyUsers(@Body() userdata: CreateUserDTO, @User() CallerId: number):
		Promise<UserModel> {
			userdata.id = CallerId
			userdata.admin = await (await this.userService.fuser(CallerId)).admin
			console.log("[Put user] modifying user request: ", userdata);
			return await this.userService.updateUser({
				where: {id: CallerId},
				data: (userdata as any),
				})
		}//

	@UseGuards(JwtAuthGuard)
	@Put('chpassword')
	async modifypassword(
		@Body() userdata: {id: string | number, password?:string, newsalt?:string}):
		Promise<UserModel | null> {
			console.log("[Put user] modifying user request: ", userdata);
			const OurUser = await this.userService.fuser(userdata.id)
			if (OurUser != null)
			{
				console.log("[put user] User found ", OurUser.id)
				const pass = await this.authService.makepass(userdata.password)
				await this.userService.updatePass({
					where: {id: OurUser.id},
					data: {salted_password: pass.salted_password, salt: pass.salt}
				})
				// return this.userService.updateUser({
				// 	where: {email: userdata.email},
				// 	data: {secure: {salted_password: userdata.newpass}}
				// })
				return(OurUser);
			}
			console.log("[put user] user not found")
			return (null);
			// ok
		}

	@UseGuards(JwtAuthGuard)
	@Put('chemail')
	async modifyemail(
		@Body() userdata: {email: string; newmail?:string},):
		Promise<UserModel> {
			console.log("[Put user] modifying user request: ", userdata);
			return this.userService.updateUser({
				where: {email: userdata.email},
				data: {name: userdata.newmail}
			})
		}

	@UseGuards(JwtAuthGuard)
	@Put('makeadmin')
	async makeadmin(
		@Body() userdata: {email: string; newpass?:string},):
		Promise<UserModel> {
			console.log("[Put user] modifying user request: ", userdata);
			return this.userService.updateUser({
				where: {email: userdata.email},
				data: {name: userdata.newpass}
			})
		}

	@Public()
	@Get('logged')
	async amIlogged(): Promise<any> {
		return "yes !";
	}
	//Modify user
	//Delete user

/*
curl --request POST \
  --url http://localhost:2000/api/newuser \
  --header 'Content-Type: application/json' \
  --data '{
  "email": "bill@gmfail.com",
	"password": "betty"
}'
*/

	// @Post('updateuser')
	// async updateUser(
	// 	@Body() userData: {}
	// )




}
