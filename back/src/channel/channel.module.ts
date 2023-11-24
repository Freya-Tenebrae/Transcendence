import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ArchivementModule } from 'src/archivement/archivement.module';

@Module({
	imports: [PrismaModule, ArchivementModule, AuthModule],
  	providers: [PrismaModule, ChannelService, ArchivementModule],
	controllers: [ChannelController],
  	exports: [ChannelService],
})
export class ChannelModule {}
