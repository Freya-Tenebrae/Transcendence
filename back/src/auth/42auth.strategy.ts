import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { clientSecretConstant, clientidConstant } from './constant';
import { AuthService } from './auth.service';

@Injectable()
export class oath42 extends PassportStrategy(Strategy, '42auth') {
  constructor(private AuthService: AuthService) {	
    super({
	  clientID: clientidConstant.secret,
	  clientSecret: clientSecretConstant.secret,
	  callbackURL: 'http://0.0.0.0:2000/auth/callback'
    });
  }

  // 	id                          Int @unique @id @default(autoincrement())
// 	name                        String?
// 	surname                     String?
// 	nickname                    String?
// 	email                       String? @unique
// 	admin                       Int @default(0)
// 	password                    Pass?
// 	// lastConnection             DateTime @default(now())
// 	pathAvatar                 String @default("avatar/default_avatar.png")
  async validate(accessToken, refreshToken, profile, cb): Promise<any> {
	if (!profile)
	{
		console.log("[oauth strategy validate] fail not a real user")
		throw new UnauthorizedException();
	}
	const myshit = {
		email: profile._json.email,
		name: profile._json.first_name,
		surname: profile._json.last_name,
		nickname: profile._json.login,
		pathAvatar: profile._json.image.link,
		password: {
			create: {
				oAuth42Link: "i'm a 42 student"
			}
		}
	}
	const myUser = await this.AuthService.makeorret(myshit as any)
	// console.log("[42auth strategy validate] called")
	// console.log("Access token ", accessToken)
	// console.log("Refresh token ", refreshToken)
	// console.log("profile ", profile)
	// console.log("==========================")
	// console.log("profile json id", profile._json.id)
	// console.log("profile id", profile.id)
	// console.log("==========================")

	//const myUser = this.

	// console.log("cb ", cb)
    return myUser;
  }
}////

// back     |   _json: {
// 	back     |     id: 56097,
// 	back     |     email: 'mmercore@student.42.fr',
// 	back     |     login: 'mmercore',
// 	back     |     first_name: 'Maximilien',
// 	back     |     last_name: 'Mercorelli',
// 	back     |     usual_full_name: 'Maximilien Mercorelli',
// 	back     |     usual_first_name: null,
// 	back     |     url: 'https://api.intra.42.fr/v2/users/mmercore',
// 	back     |     phone: 'hidden',
// 	back     |     displayname: 'Maximilien Mercorelli',
// 	back     |     kind: 'student',
// 	back     |     image: {
// 	back     |       link: 'https://cdn.intra.42.fr/users/5be521bc9a9e47d1e6d6fa3274556a16/mmercore.jpg',
// 	back     |       versions: [Object]
// 	back     |     },
// 	back     |     'staff?': false,
// 	back     |     correction_point: 2,
// 	back     |     pool_month: 'june',
// 	back     |     pool_year: '2019',
// 	back     |     location: 'paul-f4Br3s5',
// 	back     |     wallet: 1135,
// model User {
// 	id                          Int @unique @id @default(autoincrement())
// 	name                        String?
// 	surname                     String?
// 	nickname                    String?
// 	email                       String? @unique
// 	admin                       Int @default(0)
// 	password                    Pass?
// 	// lastConnection             DateTime @default(now())
// 	pathAvatar                 String @default("avatar/default_avatar.png") //should be stored to avatar/*user_id* 
// 	// is_connected               Boolean @default(true)
// 	elo                       	Int @default(1000)
// 	// division                   Division @relation(fields: [user_divisionId], references: [division_id])
// 	// divisionId                 Int @default(0)
// 	player1Matches              Game[] @relation("player1")
// 	player2Matches              Game[] @relation("player2")
// 	channelsMessages            ChannelMessage[]
// 	isMemberOf                  IsMemberOf[]
// 	PrivateMessages1            PrivateMessage[] @relation("user1")
// 	PrivateMessages2            PrivateMessage[] @relation("user2")
// 	Friend1                     Friend[] @relation("user1")
// 	Friend2                     Friend[] @relation("user2")
// 	Blocked1                    Blocked[] @relation("user1")
// 	Blocked2                    Blocked[] @relation("user2")
//   }

// export const User = createParamDecorator(
//   (data: string, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     const user = request.user;

//     return data ? user?.[data] : user.userId;
//   },
// );