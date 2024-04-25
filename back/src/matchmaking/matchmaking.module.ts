import { Module } from '@nestjs/common';
import { MatchmakingController } from './matchmaking.controller';
import { MatchmakingService } from './matchmaking.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GameModule } from 'src/game/game.module';
import { ArchivementModule } from 'src/archivement/archivement.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [PrismaModule, GameModule, ArchivementModule, AuthModule],
  	providers: [PrismaModule, MatchmakingService, GameModule, ArchivementModule, AuthModule],
	controllers: [MatchmakingController],
  	exports: [MatchmakingService],
})
export class MatchmakingModule {}
