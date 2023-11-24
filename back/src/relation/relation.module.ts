import { Module } from '@nestjs/common';
import { RelationController } from './relation.controller';
import { RelationService } from './relation.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ArchivementModule } from 'src/archivement/archivement.module';

@Module({
	imports: [PrismaModule, ArchivementModule, AuthModule],
  	providers: [PrismaModule, RelationService, ArchivementModule],
	controllers: [RelationController],
  	exports: [RelationService],
})
export class RelationModule {}
