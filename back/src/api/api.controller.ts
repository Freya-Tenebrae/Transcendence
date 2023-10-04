import { Controller, Get, Post, Body, HttpCode, HttpStatus, Param} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from '../users/users.service';

//import { }

@Controller('api')
export class ApiController {
	constructor(
		private readonly userService: UserService,
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

	@Get('user/id/:id')
	async findUserbyID(@Param('id') id:string): Promise<UserModel>{
		console.log("[api controller user/:id]Returning user by id ", id);
		return this.userService.user({id : Number(id)})
	}

	@Get('user/id')
	async findUserbyIDr(@Body() userData: {id: number}): Promise<UserModel>{
		console.log("[api controller user/id req]Returning user requested as ", userData);
		return this.userService.user(userData)
	}

	@Get('user/mail/:mail')
	async findUserbyMail(@Param('mail') mail:string): Promise<UserModel>{
		console.log("[api controller user/:mail]Returning user by mail ", mail);
		return this.userService.user({email : String(mail)})
	}

	@Get('user/mail')
	async findUserbyMailr(@Body() userData: {email: string}): Promise<UserModel>{
		console.log("[api controller user/mail req]Returning user requested as ", userData);
		return this.userService.user(userData)
	}

	@Get('user')
	async findUserr(@Body() userData): Promise<UserModel>{
		console.log("[api controller user req]Returning user requested as ", userData);
		return this.userService.user(userData)
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
	@Post('user')
	async newUser(
	  @Body() userData: { name?: string; email: string },
	): Promise<UserModel> {
	  console.log("New user sign up");
	  return this.userService.createUser(userData);
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
