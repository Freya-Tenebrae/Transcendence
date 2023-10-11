import { Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { CreateGameDto } from './dto';
import { GameService } from './game.service';
import { Game } from './interface/game.interface';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    this.gameService.create(createGameDto);
  }

  @Get()
  async findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Game | undefined> {
    return this.gameService.findById(id);
  }

  // @Put(':id')
  // async update(@Param('id') id: number, @Body() updateGameDto: UpdateGameDto) {
  //   return `This action updates a #${id} game`;
  // }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    if (this.gameService.findById(id)) {
      this.gameService.remove(id);
      return `Game with ID #${id} has been deleted.`;
    } else {
      throw new Error(`Game with ID #${id} not found.`);
    }
  }
}