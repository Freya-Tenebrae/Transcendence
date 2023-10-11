import { Injectable } from '@nestjs/common';
import { Provider } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Game } from './interfaces/game.interface';


@Injectable()
export class GameService {

  private game: Game[] = [];

  create(game: Game) {
    this.game.push(game);
  }

  findAll(): Game[] {
    return this.game;
  }

  findById(id: number): Game | undefined {
    return this.game.find((game) => game.id === id);
  }

  remove(id: number): void {
    this.games = this.game.filter((game) => game.id !== id);
  }
}