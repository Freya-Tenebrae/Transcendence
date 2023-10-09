import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Pass, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
	console.log("[user service user] Found ", this.prisma.user.findUnique({
		where: userWhereUniqueInput,
	  }));
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async pass(
    passWhereUniqueInput: Prisma.PassWhereUniqueInput,
  ): Promise<Pass | null> {
	console.log("[user service pass] Found ", this.prisma.pass.findUnique({
		where: passWhereUniqueInput,
	  }));
    return this.prisma.pass.findUnique({
      where: passWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
	console.log('User created : ', data);
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async createPass(data: Prisma.PassCreateInput): Promise<Pass> {
	console.log('Pass created : ', data);
    return this.prisma.pass.create({data});
  }

  async updatePass(params: {
    where: Prisma.PassWhereUniqueInput;
    data: Prisma.PassUpdateInput;
  }): Promise<Pass> {
    const { where, data } = params;
    return this.prisma.pass.update({
      data,
      where,
    });
  }

  async deletePass(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async userId(where: Prisma.UserWhereUniqueInput): Promise<Number> {
	return this.user(where)['id'];
  }

  async passId(where: Prisma.PassWhereUniqueInput): Promise<Number> {
	return this.prisma.pass.findUnique({where})['id'];
  }

  async IdGetPass(id: Number): Promise<Pass | null> {
	return this.pass({id: Number(id)})
  }

  async checkuserpass(pass: String, id: Number): Promise<Boolean> {
	if ((await this.IdGetPass(id)).salted_password !== pass)
	{
		return true;
	}
	return false;
		console.log("gottem");
  }
}