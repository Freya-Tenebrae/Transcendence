import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot({ignoreEnvFile: true,}), ApiModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
