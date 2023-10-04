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

	@Get('user/mail/:mail')
	async findUserbyMail(@Param('mail') mail:string): Promise<UserModel>{
		console.log("[api controller user/:mail]Returning user by mail ", mail);
		return this.userService.user({email : String(mail)})
	}

	//@HttpCode(HttpStatus.OK)
	@Post('newuser')
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
