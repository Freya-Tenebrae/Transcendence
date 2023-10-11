import { Injectable } from '@nestjs/common';
import { Provider } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game } from './interfaces/game.interface';
import { timer } from 'rxjs';


@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  private game: Game[] = [];

  create(game: Game) {
    this.game.push(game);
  }

  async createNewGame(userId1: number, userId2: number, isRanked:boolean ) {
    const randomInt = Math.floor(Math.random() * 2);
    let directionX: number;

    if (randomInt == 0)
      directionX = -1;
    else
      directionX = 1;

    const newGamePrisma = await this.prisma.game.create({
      data: {
        userId1,
        userId2,
        isRanked,
      },
    });

    const newGame: Game = {
      id: newGamePrisma.id,
      userId1: newGamePrisma.userId1,
      userId2: newGamePrisma.userId2,
      isRanked: newGamePrisma.isRanked,
      isOver: newGamePrisma.isOver,
      scoreUser1: newGamePrisma.scoreUser1,
      scoreUser2: newGamePrisma.scoreUser2,
      date: newGamePrisma.date,
      started: false,
      timeRemaining: 125, //check if 2mn is enouth and not too much (and 5s before start)
      player1_posY: 0,
      player2_posY: 0,
      ball_posY: 0,
      ball_posX: 0,
      ball_directionY: 0,
      ball_directionX: directionX,
    }
    this.game.push(newGame);
  }

  async runningGame(id: number, userId: number, playerPosY: number) {
    const gameToUpdate = this.game.find((game) => game.id === id);
    if (gameToUpdate && !gameToUpdate.isOver)
    {
      const now = new Date()
      const elapsedMs = now.getTime() - gameToUpdate.date.getTime();
      gameToUpdate.timeRemaining = gameToUpdate.timeRemaining - elapsedMs / 1000;
      if (!gameToUpdate.started)
      {
        if (gameToUpdate.timeRemaining <= 120)
          gameToUpdate.started = true;
      } else {
        // update position of player
        if (userId === gameToUpdate.userId1)
          gameToUpdate.player1_posY = playerPosY;
        else if (userId === gameToUpdate.userId2)
          gameToUpdate.player2_posY = playerPosY;
        
        // update position of ball
        // X (and manage points)
        gameToUpdate.ball_posX = gameToUpdate.ball_posX + gameToUpdate.ball_directionX * elapsedMs / 1000;
        if (gameToUpdate.ball_posX >= 1 || gameToUpdate.ball_posX <= -1)
        {
          if (gameToUpdate.ball_posX >= 1)
          {
            gameToUpdate.scoreUser1 = gameToUpdate.scoreUser1 + 1;
            gameToUpdate.ball_directionX = -1;
          }
          else
          {
            gameToUpdate.scoreUser2 = gameToUpdate.scoreUser2 + 1;
            gameToUpdate.ball_directionX = +1;
          }
          gameToUpdate.ball_posY = 0;
          gameToUpdate.ball_posY = 0;
        }
  
        // Y
        gameToUpdate.ball_posY = gameToUpdate.ball_posY + gameToUpdate.ball_directionY * elapsedMs / 1000;
        if (gameToUpdate.ball_posY > 1)
          gameToUpdate.ball_directionY = 1 - (gameToUpdate.ball_posY - 1);
        else if (gameToUpdate.ball_posY < -1)
          gameToUpdate.ball_directionY = -1 - (gameToUpdate.ball_posY + 1);
  
        // update time remaining
        if (gameToUpdate.timeRemaining <= 0)
        {
          gameToUpdate.timeRemaining = 0;
          gameToUpdate.isOver = true;
          // update ddb values
          const gameToUpdatePrisma = await this.prisma.game.update({
            where: { id: gameToUpdate.id },
            data: {
              isOver: gameToUpdate.isOver,
              scoreUser1: gameToUpdate.scoreUser1,
              scoreUser2: gameToUpdate.scoreUser2,
            },
          });
        }
      }
      gameToUpdate.date = now;
    }
  }

  findAll(): Game[] {
    return this.game;
  }

  async findAllForOneUser(userId: number): Promise<Game[]> {
    const gamePrismaWhereUser1 = await this.prisma.game.findMany({where: { userId1: userId },});
    const gamePrismaWhereUser2 = await this.prisma.game.findMany({where: { userId2: userId },});
    const gamePlayer = this.game.filter((game) => game.userId1 === userId || game.userId2 === userId)

    gamePrismaWhereUser1.forEach((gamePrisma) => {
      let found: boolean = false;
      if (gamePlayer.some((game) => game.id === gamePrisma.id))
        found = true;
      if (!found)
      {
        const olderGame: Game = {
          id: gamePrisma.id,
          userId1: gamePrisma.userId1,
          userId2: gamePrisma.userId2,
          isRanked: gamePrisma.isRanked,
          isOver: gamePrisma.isOver,
          scoreUser1: gamePrisma.scoreUser1,
          scoreUser2: gamePrisma.scoreUser2,
          date: gamePrisma.date,
          started: true,
          timeRemaining: 0,
          player1_posY: 0,
          player2_posY: 0,
          ball_posY: 0,
          ball_posX: 0,
          ball_directionY: 0,
          ball_directionX: 0,
        }
        this.game.push(olderGame);
      }
    });

    gamePrismaWhereUser2.forEach((gamePrisma) => {
      let found: boolean = false;
      if (gamePlayer.some((game) => game.id === gamePrisma.id))
        found = true;
      if (!found)
      {
        const olderGame: Game = {
          id: gamePrisma.id,
          userId1: gamePrisma.userId1,
          userId2: gamePrisma.userId2,
          isRanked: gamePrisma.isRanked,
          isOver: gamePrisma.isOver,
          scoreUser1: gamePrisma.scoreUser1,
          scoreUser2: gamePrisma.scoreUser2,
          date: gamePrisma.date,
          started: true,
          timeRemaining: 0,
          player1_posY: 0,
          player2_posY: 0,
          ball_posY: 0,
          ball_posX: 0,
          ball_directionY: 0,
          ball_directionX: 0,
        }
        this.game.push(olderGame);
      }
    });

    return this.game.filter((game) => game.userId1 === userId || game.userId2 === userId);
  }

  async findById(id: number): Promise<Game | undefined> {
    if (this.game.find((game) => game.id === id))
      return this.game.find((game) => game.id === id);
    else
    {
      const gamePrisma = await this.prisma.game.findUnique({where: { id: id },});

      const olderGame: Game = {
        id: gamePrisma.id,
        userId1: gamePrisma.userId1,
        userId2: gamePrisma.userId2,
        isRanked: gamePrisma.isRanked,
        isOver: gamePrisma.isOver,
        scoreUser1: gamePrisma.scoreUser1,
        scoreUser2: gamePrisma.scoreUser2,
        date: gamePrisma.date,
        started: true,
        timeRemaining: 0,
        player1_posY: 0,
        player2_posY: 0,
        ball_posY: 0,
        ball_posX: 0,
        ball_directionY: 0,
        ball_directionX: 0,
      }
      this.game.push(olderGame);

      return olderGame;
    }
  }

  remove(id: number): void {
    this.game = this.game.filter((game) => game.id !== id);
  }
}