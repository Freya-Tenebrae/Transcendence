import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	controllers: [ApiController],
	providers: [UsersModule, PrismaModule],
	imports: [UsersModule, PrismaModule],
})
export class ApiModule {}
