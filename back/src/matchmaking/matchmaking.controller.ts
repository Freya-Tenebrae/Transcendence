import {  Controller, Get, Post, Put, Param, Delete } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, UseGuards} from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { Matchmaking } from './interfaces/matchmaking.interface';
import { User } from 'src/users/users.decorator';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { parseBooleanPipe, numberValidityPipe } from 'src/injectable';

@Controller('matchmaking')
export class MatchmakingController
{
  constructor(private matchmakingService: MatchmakingService, private authService: AuthService) {}

    // return active matchmaking with matchmakingId
    @Get('/matchmakingId/:matchmakingId(\\d+)')
    async findMatchmakingById(
        @Param('matchmakingId', numberValidityPipe) matchmakingId: number
    ): Promise<Matchmaking | undefined>
    {
        return this.matchmakingService.findMatchmakingById(matchmakingId);
    }
    

    // return active matchmaking with userId
    @UseGuards(JwtAuthGuard)
    @Get('/userId/:userId(\\d+)')
    async findMatchmakingByUser(
        @Param('userId', numberValidityPipe) userId: number,
        @User() CallerId: number
    ): Promise<Matchmaking | undefined>
    {
        if (await this.authService.verifysame({id: userId}, CallerId) == false)
            return({message: "Intruder !!!"} as any)
        return this.matchmakingService.findMatchmakingByUser(userId);
    }

    // return active matchmaking for user
    @UseGuards(JwtAuthGuard)
    @Post('/create/:userId(\\d+)/:isRanked')
    async createMatchmaking(
        @Param('userId', numberValidityPipe) userId: number,
        @Param('isRanked', parseBooleanPipe) isRanked: boolean,
        @User() CallerId: number
    ): Promise<Matchmaking | undefined>
    {
        if (await this.authService.verifysame({id: userId}, CallerId) == false)
            return({message: "Intruder !!!"} as any)
        return this.matchmakingService.createMatchmaking(userId, isRanked);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/cancel/:userId(\\d+)')
    async cancelMatchmaking(
        @Param('userId', numberValidityPipe) userId: number,
        @User() CallerId: number
    ): Promise <Boolean>
    {
        if (await this.authService.verifysame({id: userId}, CallerId) == false)
            return({message: "Intruder !!!"} as any)
        return this.matchmakingService.cancelMatchmaking(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/initiateDuel/:userId(\\d+)/:targetUserId(\\d+)')
    async initiateDuel(
        @Param('userId', numberValidityPipe) userId: number,
        @Param('targetUserId', numberValidityPipe) targetUserId: number,
        @User() CallerId: number
    ): Promise<Matchmaking | undefined>
    {
        if (await this.authService.verifysame({id: userId}, CallerId) == false)
            return({message: "Intruder !!!"} as any)
        return this.matchmakingService.createDuelRequest(userId, targetUserId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/acceptDuel/:userId(\\d+)')
    async acceptDuel(
        @Param('userId', numberValidityPipe) userId: number,
        @User() CallerId: number
    ): Promise<Matchmaking | undefined>
    {
        if (await this.authService.verifysame({id: userId}, CallerId) == false)
            return({message: "Intruder !!!"} as any)
        return this.matchmakingService.acceptDuelRequest(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/cancelDuel/:userId(\\d+)')
    async cancelDuel(
        @Param('userId', numberValidityPipe) userId: number,
        @User() CallerId: number
    ): Promise<boolean>
    {
        if (await this.authService.verifysame({id: userId}, CallerId) == false)
            return({message: "Intruder !!!"} as any)
        return this.matchmakingService.cancelOrDenyDuelRequest(userId);
    }
}