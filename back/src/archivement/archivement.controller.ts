import { ArgumentMetadata, BadRequestException, Controller, Get, Injectable, Param, PipeTransform } from '@nestjs/common';
import { ArchivementService } from './archivement.service';
import { Archivement } from './interfaces/archivement.interface';
import { ArchivementDone } from './interfaces/archivementDone.interface';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class numberValidityPipe implements PipeTransform {
  transform(value: number, metadata: ArgumentMetadata) {
    if (!value || value == null || value > 1000000 || value < -1000000)
      throw new BadRequestException('Invalid number Value');
    return value;
  }
}

@Controller('archivement')
export class ArchivementController
{
    constructor(private archivementService: ArchivementService, private authService: AuthService) {}

    @Get('/findAllArchivements')
    async findAllArchivements(): Promise<Archivement[]>
    {
        return this.archivementService.findAllArchivements();
    }

    @Get('/findArchivementsDone/:userId(\\d+)')
    async findArchivementsDone(
        @Param('userId', numberValidityPipe) userId: number,
    ): Promise<ArchivementDone[]>
    {
        return this.archivementService.findArchivementsDone(userId);
    }
}