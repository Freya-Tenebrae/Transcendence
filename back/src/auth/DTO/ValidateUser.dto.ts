import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IsNumber,
  Min,
} from 'class-validator';

export class ValidateUserDTO {

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
// /
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
	password?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	oathlink?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	xliilink?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	OTP?: string;//


}

// export class CreateArticleDto {
//   @IsString()
//   @IsNotEmpty()
//   @MinLength(5)
//   @ApiProperty()
//   title: string;

//   @IsString()
//   @IsOptional()
//   @IsNotEmpty()
//   @MaxLength(300)
//   @ApiProperty({ required: false })
//   description?: string;

//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty()
//   body: string;

//   @IsBoolean()
//   @IsOptional()
//   @ApiProperty({ required: false, default: false })
//   published?: boolean = false;
// }