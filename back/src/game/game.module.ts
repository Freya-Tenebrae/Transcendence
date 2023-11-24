import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [PrismaModule, AuthModule],
  	providers: [PrismaModule, GameService],
	controllers: [GameController],
  	exports: [GameService],
})
export class GameModule {}
