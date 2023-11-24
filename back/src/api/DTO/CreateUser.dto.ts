import { ApiProperty } from '@nestjs/swagger';
import { Prisma, User, Pass } from '@prisma/client';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IS_STRONG_PASSWORD,
  IsStrongPassword,
  Max,
  Min,
  IsNumber,
  IsISO8601,
} from 'class-validator';
import { expand } from 'rxjs';
import { ValidateUserDTO } from 'src/auth/DTO/ValidateUser.dto';

export class SearchDTO {
	@IsString()
	@IsOptional()
	@ApiProperty()
	searchstring?: string

	@IsString()
	@IsOptional()
	@ApiProperty()
	sort?: string

	@IsString()
	@IsOptional()
	@ApiProperty()
	asc?: string

	@IsString()
	@IsOptional()
	@ApiProperty()
	field?: string
}

export class CreatePassDTO implements Pass {

	//user?:	CreateUserDTO;

	@IsNumber()
	@Min(0, {message: "Id can't be lower than 0"})
	@IsOptional()
	@ApiProperty()
	id:	number;

	@IsString({
		message: "Password must be a string"
	})
	@IsNotEmpty({
		message: "Password cannot be empty"
	})
	@MinLength(5, {
		message: "Password is too short"
	})
	@IsOptional()
	@ApiProperty()
	salted_password: string;


	@IsString()
	@IsOptional()
	@ApiProperty()
	salt: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	oAuth42Link: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	googleAuthLink: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	OTPSecret: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	OTPToken: string;
}

export class CreateUserDTO{

	@IsNumber()
	@Min(0, {message: "Id can't be lower than 0"})
	@IsOptional()
	@ApiProperty()
	id?:	number;

	@IsString({
		message: "Email must be a string"
	})
	@IsNotEmpty({
		message: "Email cannot be empty"
	})
	@IsEmail()
	@ApiProperty()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	name?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	surname?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	nickname?: string;

	@IsNumber()
	@IsOptional()
	@ApiProperty()
	@Max(1, {message: "You can't pass this value to admining (too high)"})
	@Min(0, {message: "You can't pass this value to admining (too low)"})
	admin?: number;

	@IsString()
	@IsOptional()
	@ApiProperty()
	pathAvatar?: string;

	@IsNumber()
	@IsOptional()
	@ApiProperty()
	@Min(0, {message: "Can't have negative ELO"})
	elo?:	number;

	@IsOptional()
	@ApiProperty()
	password?: CreatePassDTO;

	@IsISO8601({strict: true,})
	@IsString()
	@IsOptional()
	@ApiProperty()
	heartbeat?: Date;
	//Player1matches
	//Player2Matches
	//Channel messages
	//IsmemberofCreateNestedOneWithoutUserInput
	//PrivateMessages1
	//PrivateMessages2
	//Friend1
	//Friend2
	//Blocked1
	//Blocked2
}




// PassCreateNestedOneWithoutUserInput: {

// }