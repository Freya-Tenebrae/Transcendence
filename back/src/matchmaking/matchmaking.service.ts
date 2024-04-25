import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from '../game/game.service';
import { Matchmaking } from './interfaces/matchmaking.interface';
import { ArchivementService } from 'src/archivement/archivement.service';
import { Game } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class MatchmakingService
{
    private matchmaking: Matchmaking[] = [];
    private numberMatchmaking: number = 0;

    constructor(private prisma: PrismaService, private game: GameService, private archivement: ArchivementService, private authService: AuthService)
    {
        setInterval(async () =>
        {
            for (let i = 0; i < this.matchmaking.length; i++)
            {
                if (!this.matchmaking[i].isMatchmakingLinked)
                    await this.updateMatchmakingSearch(i);
                else if (this.matchmaking[i].isDuel == true && this.matchmaking[i].idGameLinked == 0)
                    await this.updateMatchmakingDuel(i);
                else
                    await this.resolveGameOver(i);
            }
        }, 1000);
    }

    async findMatchmakingById(matchmakingId: number): Promise<Matchmaking | undefined>
    {
        if (this.matchmaking.find((matchmaking) => matchmaking.id == matchmakingId))
            return this.matchmaking.find((matchmaking) => matchmaking.id == matchmakingId);
        else
            return undefined;
    }

    // find matchmaking with userId (or duel)
    async findMatchmakingByUser(userId: number): Promise<Matchmaking | undefined>
    {
        if (this.matchmaking.find((matchmaking) => matchmaking.userId == userId))
            return this.matchmaking.find((matchmaking) => matchmaking.userId == userId);
        else
            return undefined;
    }

    // create matchmaking
    async createMatchmaking(userId: number, isRanked: boolean): Promise<Matchmaking | undefined>
    {
        if (this.matchmaking.find((matchmaking) => matchmaking.userId == userId))
            return undefined;

        const PrismaUser = await this.prisma.user.findUnique({where: { id: Number(userId) },});

        if (!PrismaUser)
            return undefined;

        const newMatchmaking: Matchmaking =
        {
            id: ++this.numberMatchmaking,
            userId: userId,
            userElo: PrismaUser.elo,
            userOldElo: PrismaUser.elo,
            isRanked: isRanked,
            date: new Date(),
            isDuel: false,
            isDuelAccepted: false,
            isMatchmakingLinked: false,
            idGameLinked: 0,
            idDuelLinked: 0,
        }

        this.matchmaking.push(newMatchmaking);
        return newMatchmaking;
    }

    async cancelMatchmaking(userId: number)
    {
        const matchmakingToDelete = this.matchmaking.find((matchmaking) => matchmaking.userId == userId);
        if (matchmakingToDelete && matchmakingToDelete.isDuel == false &&
            matchmakingToDelete.isMatchmakingLinked == false)
        {
            const index = this.matchmaking.indexOf(matchmakingToDelete);
            delete this.matchmaking[index];
            this.matchmaking.splice(index, 1);
            return true;
        }
        return false;
    }

    async createDuelRequest(userId: number, targetUserId: number): Promise<Matchmaking | undefined>
    {
        if (this.matchmaking.find((matchmaking) => matchmaking.userId == userId) ||
            this.matchmaking.find((matchmaking) => matchmaking.userId == targetUserId))
            return undefined;

        const PrismaUser = await this.prisma.user.findUnique({where: { id: Number(userId) },});
        const PrismaUserTarget = await this.prisma.user.findUnique({where: { id: Number(targetUserId) },});

        if (!PrismaUser || !PrismaUserTarget)
            return undefined;

        else if (await this.authService.checkheart({id: Number(targetUserId)}) >= 1)
            await this.cancelOrDenyDuelRequest(targetUserId);

        const newDuel: Matchmaking =
        {
            id: ++this.numberMatchmaking,
            userId: userId,
            userElo: PrismaUser.elo,
            userOldElo: PrismaUser.elo,
            isRanked: false,
            date: new Date(),
            isDuel: true,
            isDuelAccepted: true,
            isMatchmakingLinked: true,
            idGameLinked: 0,
            idDuelLinked: 0,
        }

        const newDuelTarget: Matchmaking =
        {
            id: ++this.numberMatchmaking,
            userId: targetUserId,
            userElo: PrismaUserTarget.elo,
            userOldElo: PrismaUserTarget.elo,
            isRanked: newDuel.isRanked,
            date: newDuel.date,
            isDuel: newDuel.isDuel,
            isDuelAccepted: false,
            isMatchmakingLinked: newDuel.isMatchmakingLinked,
            idGameLinked: 0,
            idDuelLinked: newDuel.id,
        }

        newDuel.idDuelLinked = newDuelTarget.id;

        this.matchmaking.push(newDuel);
        this.matchmaking.push(newDuelTarget);
        return newDuel;
    }

    async acceptDuelRequest(userId: number): Promise<Matchmaking | undefined>
    {
        const duelToAccept = this.matchmaking.find((matchmaking) => matchmaking.userId == userId);
        const duelToAcceptLinked = this.matchmaking.find((matchmaking) => matchmaking.id == duelToAccept.idDuelLinked);
        const indexDuelLinked = this.matchmaking.indexOf(duelToAcceptLinked);
        if (duelToAccept.isDuel == false)
            return undefined;
        
        if (duelToAccept.isDuelAccepted == true && this.matchmaking[indexDuelLinked].isDuelAccepted == true)
            return undefined;

        duelToAccept.isDuelAccepted = true;
        return duelToAccept;
    }

    async cancelOrDenyDuelRequest(userId: number): Promise<boolean>
    {
        if (this.matchmaking.find((matchmaking) => matchmaking.userId == userId) == undefined ||
            this.matchmaking.find((matchmaking) => matchmaking.userId == userId).isDuel == false ||
            this.matchmaking.find((matchmaking) => matchmaking.userId == userId).idGameLinked > 0)
            return false;

        const duelToDelete = this.matchmaking.find((matchmaking) => matchmaking.userId == userId);
        const duelToDeleteLinked = this.matchmaking.find((matchmaking) => matchmaking.id == duelToDelete.idDuelLinked);
        const indexDuelToDelete = this.matchmaking.indexOf(duelToDelete);

        delete this.matchmaking[indexDuelToDelete];
        this.matchmaking.splice(indexDuelToDelete, 1);

        const indexDuelToDeleteLinked = this.matchmaking.indexOf(duelToDeleteLinked);

        delete this.matchmaking[indexDuelToDeleteLinked];
        this.matchmaking.splice(indexDuelToDeleteLinked, 1);

        return true;
    }

    private async updateMatchmakingSearch(i: number)
    {
        const now = new Date();

        for (let j = 0; j < this.matchmaking.length; j++)
        {
            if (this.matchmaking[i].isDuel == false &&
                !this.matchmaking[j].isMatchmakingLinked &&
                this.matchmaking[i].userId != this.matchmaking[j].userId &&
                this.matchmaking[i].isRanked == this.matchmaking[j].isRanked)
            {
                const elo1 = this.matchmaking[i].userElo;
                const elo2 = this.matchmaking[j].userElo;
                const timeWaited1 = (now.getTime() - this.matchmaking[i].date.getTime()) / 1000;
                const timeWaited2 = (now.getTime() - this.matchmaking[j].date.getTime()) / 1000;
                if ((elo1 + 1 * timeWaited1 >= elo2 || elo1 + 1 * timeWaited2 <= elo1) && 
                    (elo2 + 1 * timeWaited2 >= elo1 || elo2 + 1 * timeWaited2 <= elo1))
                {
                    const gameId = await this.createGame(this.matchmaking[i], this.matchmaking[j]);
                    if (gameId != -1)
                    {
                        this.matchmaking[i].idGameLinked = gameId;
                        this.matchmaking[j].idGameLinked = gameId;
                        this.matchmaking[i].isMatchmakingLinked = true;
                        this.matchmaking[j].isMatchmakingLinked = true;
                    }
                }
            }
        }
    }

    private async updateMatchmakingDuel(i: number)
    {
        const duelLinked = this.matchmaking.find((matchmaking) => matchmaking.id == this.matchmaking[i].idDuelLinked);
        const indexDuelLinked = this.matchmaking.indexOf(duelLinked);

        if (this.matchmaking[i].idGameLinked == 0 &&
            this.matchmaking[i].isDuelAccepted == true &&
            this.matchmaking[indexDuelLinked] &&
            this.matchmaking[indexDuelLinked].isDuelAccepted == true)
        {
            const gameId = await this.createGame(this.matchmaking[i], this.matchmaking[indexDuelLinked]);
            if (gameId > 0)
            {
                this.matchmaking[i].idGameLinked = gameId;
                this.matchmaking[indexDuelLinked].idGameLinked = gameId;
                this.matchmaking[i].isMatchmakingLinked = true;
                this.matchmaking[indexDuelLinked].isMatchmakingLinked = true;
            }
        }
        else if (await this.authService.checkheart({id: Number(this.matchmaking[i].userId)}) >= 1)
            await this.cancelOrDenyDuelRequest(this.matchmaking[i].userId);
    }

    private async createGame(matchmaking1: Matchmaking, matchmaking2: Matchmaking): Promise<number>
    {
        const gameId = await this.game.createNewGame(matchmaking1.userId, matchmaking2.userId, matchmaking1.isRanked);
        if (gameId)
            return gameId;
        else
            return -1;
    }

    private async resolveGameOver(i: number)
    {
        const game = await this.game.findById(this.matchmaking[i].idGameLinked);
        if (game.isOver)
        {
            if (game.isRanked == false)
                await this.resolveGameOverForNormalGame(game);
            else
                await this.resolveGameOverForRankedGame(game);

            let idGameLinkedToMatchmakingToDelete: number = game.id;
            delete this.matchmaking[i];
            this.matchmaking.splice(i, 1);
            for (let k = 0; k < this.matchmaking.length; k++)
            {
                if (this.matchmaking[k].idGameLinked == idGameLinkedToMatchmakingToDelete)
                {
                    delete this.matchmaking[k];
                    this.matchmaking.splice(k, 1);
                    break;
                }
            }
            // i = 0; // TODO: Need to check if i need to update i or not (to prevent crash, false mofication and co)
        }

    }

    private async resolveGameOverForNormalGame(game: Game)
    {
        let userIdWinner: number = await this.getWinnerId(game);

        if (userIdWinner != 0)
        {
            let nbrWin: number = await this.getNumberOfWinSpecificTypeOfGame(userIdWinner, false);

            if (nbrWin >= this.archivement.archivementVeteranMercenaryNeededWin)
                this.archivement.unlockArchivements(userIdWinner, this.archivement.archivementIdVeteranMercenary);
            else if (nbrWin >= this.archivement.archivementMercenaryNeededWin)
                this.archivement.unlockArchivements(userIdWinner, this.archivement.archivementIdMercenary);
            else if (nbrWin >= this.archivement.archivementNewMercenaryNeededWin)
                this.archivement.unlockArchivements(userIdWinner, this.archivement.archivementIdNewMercenary);
        }
    }

    private async resolveGameOverForRankedGame(game: Game)
    {
        const PrismaUser1 = await this.prisma.user.findUnique({where: {id: Number(game.userId1)},});
        const PrismaUser2 = await this.prisma.user.findUnique({where: {id: Number(game.userId2)},});
        if (!PrismaUser1 || !PrismaUser2)
            return ;

        const newEloUser1: number = await this.eloCalc(PrismaUser1.elo, PrismaUser2.elo, game.scoreUser1, game.scoreUser2);
        const newEloUser2: number = await this.eloCalc(PrismaUser2.elo, PrismaUser1.elo, game.scoreUser2, game.scoreUser1);

        const PrismaUser1Updated = await this.prisma.user.update({where: {id: Number(game.userId1)}, data: {elo: Number(newEloUser1)},});
        const PrismaUser2Updated = await this.prisma.user.update({where: {id: Number(game.userId2)}, data: {elo: Number(newEloUser2)},});

        if (!PrismaUser1Updated || !PrismaUser2Updated)
            return ;

        let userIdWinner: number = await this.getWinnerId(game);

        if (userIdWinner != 0)
        {
            let nbrWin: number = await this.getNumberOfWinSpecificTypeOfGame(userIdWinner, true);
            const positionLeaderboard = await this.getPositionLeaderboard(userIdWinner);

            if (nbrWin >= this.archivement.archivementVeteranEdgerunnerNeededWin)
                this.archivement.unlockArchivements(userIdWinner, this.archivement.archivementIdVeteranEdgerunner);
            else if (nbrWin >= this.archivement.archivementEdgerunnerNeededWin)
                this.archivement.unlockArchivements(userIdWinner, this.archivement.archivementIdEdgerunner);
            else if (nbrWin >= this.archivement.archivementNewEdgerunnerNeededWin)
                this.archivement.unlockArchivements(userIdWinner, this.archivement.archivementIdNewEdgerunner);

            if (positionLeaderboard <= this.archivement.archivementRisingLegendNeededTop)
                this.archivement.unlockArchivements(userIdWinner, this.archivement.archivementIdRisingLegend);
            if (positionLeaderboard <= this.archivement.archivementNighticityLegendNeededTop)
                this.archivement.unlockArchivements(userIdWinner, this.archivement.archivementIdNighticityLegend);
        }
    }

    private async eloCalc(eloSelf: number, eloFoe: number, scoreSelf: number, scoreFoe: number): Promise<number>
    {
        let newElo: number
        if (scoreSelf >= scoreFoe)
            newElo = eloSelf + (scoreSelf - scoreFoe) * (eloFoe / eloSelf) + 10;
        else
            newElo = eloSelf + (scoreSelf - scoreFoe) * (eloSelf / eloFoe) - 10;

        if (newElo <= eloSelf - 100)
            newElo = eloSelf - 100;
        else if (newElo >= eloSelf + 100)
            newElo = eloSelf + 100;

        if (newElo <= 100)
            return 100;
        return newElo;
    }

    private async getWinnerId(game: Game): Promise<number>
    {
        if (game.scoreUser1 > game.scoreUser2)
            return game.userId1;
        else if (game.scoreUser1 < game.scoreUser2)
            return game.userId2;
        else
            return 0;
    }

    private async getNumberOfWinSpecificTypeOfGame(userId: number, isRanked: boolean): Promise<number>
    {
        const allGameForUser = await this.game.findAllForOneUser(userId);
        let nbrWin: number = 0;
        for (let k = 0; k < allGameForUser.length; k++)
        {
            if (allGameForUser[k].isRanked == isRanked &&
                allGameForUser[k].isOver == true && 
                ((allGameForUser[k].userId1 == userId && 
                allGameForUser[k].scoreUser1 > allGameForUser[k].scoreUser2) || 
                (allGameForUser[k].userId2 == userId && 
                allGameForUser[k].scoreUser2 > allGameForUser[k].scoreUser1)))
                nbrWin++;
        }
        return nbrWin
    }

    private async getPositionLeaderboard(userIdWinner: number): Promise<number>
    {
        const prismaUser1 = await this.prisma.user.findMany({orderBy: [{elo: 'desc',},{id: 'desc',},],});

        for (let k = 0; k < prismaUser1.length; k++)
        {
            if (prismaUser1[k].id == userIdWinner)
                return k;
        }
    }
}