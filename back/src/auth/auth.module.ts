import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from './constant';
import { JwtStrategy } from './jwt.strategy';
import { AdminStrategy } from './admin.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.guard';
import { IdentityStrategy } from './identity.strategy';
import { HttpModule } from '@nestjs/axios';
import { oath42 } from './42auth.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersModule, oath42, LocalStrategy, AdminStrategy, IdentityStrategy, JwtStrategy,
//   {
//     provide: APP_GUARD,
//     useClass: JwtAuthGuard,
//   }
	],
  imports: [UsersModule, PassportModule,  JwtModule.register({
	secret: jwtConstant.secret,
	signOptions: { expiresIn: '24h'}
  }),
	HttpModule],
  exports: [AuthService],
})
export class AuthModule {}
