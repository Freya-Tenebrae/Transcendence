import { Module } from '@nestjs/common';
import { PrivateMessageController } from './privateMessage.controller';
import { PrivateMessageService } from './privateMessage.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RelationModule } from 'src/relation/relation.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [PrismaModule, RelationModule, AuthModule],
  	providers: [PrismaModule, PrivateMessageService, RelationModule],
	controllers: [PrivateMessageController],
  	exports: [PrivateMessageService],
})
export class PrivateMessageModule {}
