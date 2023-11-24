import { Module } from '@nestjs/common';
import { ArchivementController } from './archivement.controller';
import { ArchivementService } from './archivement.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [PrismaModule, AuthModule],
  	providers: [PrismaModule, ArchivementService],
	controllers: [ArchivementController],
  	exports: [ArchivementService],
})
export class ArchivementModule {}
