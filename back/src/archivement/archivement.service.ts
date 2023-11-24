import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Archivement } from './interfaces/archivement.interface';
import { ArchivementDone } from './interfaces/archivementDone.interface';
import { PartialType } from '@nestjs/swagger';


@Injectable()
export class ArchivementService
{
    private archivement: Archivement[] = [];
    private archivementDone: ArchivementDone[] = [];
    public archivementIdNewMercenary: number = 1;
    public archivementNewMercenaryNeededWin: number = 1;

    public archivementIdMercenary: number = 2;
    public archivementMercenaryNeededWin: number = 10;

    public archivementIdVeteranMercenary: number = 3;
    public archivementVeteranMercenaryNeededWin: number = 100;

    public archivementIdNewEdgerunner: number = 4;
    public archivementNewEdgerunnerNeededWin: number = 1;

    public archivementIdEdgerunner: number = 5;
    public archivementEdgerunnerNeededWin: number = 10;

    public archivementIdVeteranEdgerunner: number = 6;
    public archivementVeteranEdgerunnerNeededWin: number = 100;

    public archivementIdRisingLegend: number = 7;
    public archivementRisingLegendNeededTop: number = 7;

    public archivementIdNighticityLegend: number = 8;
    public archivementNighticityLegendNeededTop: number = 3;

    public archivementIdWelcomeToTheAfterlife: number = 9;
    public archivementIdVip: number = 10;
    public archivementIdPartner: number = 11;


    constructor(private prisma: PrismaService)
    {
        this.initializeValue();
    }

    private async initializeValue()
    {
        const archivementPrisma = await this.prisma.archivement.findMany();
        const archivementDonePrisma = await this.prisma.archivementDone.findMany();

        for (let i = 0; i < archivementPrisma.length; i++)
        {
            if (!this.archivement.find((archivement) => archivement.id == archivementPrisma[i].id))
            {
                const archivementFromPrisma: Archivement = {
                    id: archivementPrisma[i].id,
                    name: archivementPrisma[i].name,
                    description: archivementPrisma[i].description,
                    pathImage: archivementPrisma[i].pathImg,
                };
                this.archivement.push(archivementFromPrisma);
            }
        }

        for (let j = 0; j < archivementDonePrisma.length; j++)
        {
            if (!this.archivementDone.find((archivementDone) => 
                archivementDone.userId == archivementDonePrisma[j].userId && 
                archivementDone.archivementId == archivementDonePrisma[j].archivementId))
            {
                const isMemberOfFromPrisma: ArchivementDone = {
                    userId: archivementDonePrisma[j].userId,
                    archivementId: archivementDonePrisma[j].archivementId,
                    dateDone: archivementDonePrisma[j].date,

                };
                this.archivementDone.push(isMemberOfFromPrisma);
            }
        }
    }

    findAllArchivements(): Archivement[]
    {
        return this.archivement;
    }

    findArchivementsDone(userId: number): ArchivementDone[]
    {
        return this.archivementDone.filter((archivementDone) => archivementDone.userId == userId);
    }

    async unlockArchivements(userId: number, archivementId:number): Promise<boolean>
    {
        const archivementDone = this.archivementDone.filter((archivementDone) => archivementDone.userId == userId &&
        archivementDone.archivementId == archivementId);

        if (archivementDone && archivementDone.length > 0)
            return false;

        const user = await this.prisma.user.findUnique({where: { id: Number(userId) },});
        const archivement = await this.prisma.archivement.findUnique({where: { id: Number(archivementId) },});

        if (!user || !archivement)
            return false;

        const archivementDoneCreated = await this.prisma.archivementDone.create(
        {
            data:
            {
                userId: Number(userId),
                archivementId: Number(archivementId),
            },
        });

        if (!archivementDoneCreated)
            return false;

        const newArchivementDone: ArchivementDone = {
            userId: archivementDoneCreated.userId,
            archivementId: archivementDoneCreated.archivementId,
            dateDone: archivementDoneCreated.date,
        };
        this.archivementDone.push(newArchivementDone);

        return true;
    }
}

