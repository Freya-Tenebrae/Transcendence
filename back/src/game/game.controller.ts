import {  Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateGameDto } from './dto/createGame.dto';
import { GameService } from './game.service';
import { Game } from './interfaces/game.interface';
import { get } from 'http';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  // do not use this
  @Post()
  async createWithCreateGameDto(@Body() createGameDto: CreateGameDto) {
    this.gameService.create(createGameDto);
  }

  @Post(':userId1/:userId2/:isRanked')
  async create(@Param('userId1') userId1: number,
                @Param('userId2') userId2: number,
                @Param('isRanked') isRanked: boolean) {
    this.gameService.createNewGame(userId1, userId2, isRanked);
  }

  // should not use this
  @Get()
  async findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get(':userId')
  async findAlForOneUser(@Param('userId') userId: number): Promise<Game[]> {
    return this.gameService.findAllForOneUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Game | undefined> {
    return this.gameService.findById(id);
  }

  @Put(':id/:userId/:playerPosY')
  async update(@Param('id') id: number, 
                @Param('userId') userId: number, 
                @Param('playerPosY') playerPosY: number) {
    if (this.gameService.findById(id)) {
      this.gameService.runningGame(id, userId, playerPosY);
    } else {
      throw new Error(`Game with ID #${id} not found.`);
    }
  }

  // be carefull about this function
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    let game = await this.gameService.findById(id);
    if (game && !game.isOver) {
      this.gameService.remove(id);
      return `Game with ID #${id} has been deleted.`;
    } else {
      throw new Error(`Game with ID #${id} not found or not over.`);
    }
  }
}