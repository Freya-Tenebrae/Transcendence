import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Game } from './interfaces/game.interface';


@Injectable()
export class GameService
{
  private game: Game[] = [];

  private timeRemainingInit: number = 120;
  private timeBeforeStart: number = 5;
  private speedBallInit: number = 1;
  private speedBallHitPlayerModificator: number = 1.1;
  private speedBallHitWallModificator: number = 1.02;
  private powerPlayerInit: number = 50;
  private powerPlayerMax: number = 100;
  private powerUpNeededForSandevistanSmash: number = 20;
  private powerUpNeededForSandevistanGuard: number = 20;
  private powerUpCooldownInit: number = 1;
  private powerUpCooldownAfterUser: number = 5;
  private powerModificationWhenScoring: number = 5;
  private powerModificationWhenHit: number = 5;
  private speedPlayer: number = 2;
  private SandevistanModificator: number = 2;

  constructor(private prisma: PrismaService)
  {
    let yeet = this.prisma.game.deleteMany({where: {isOver: Boolean(false)}});
    console.log(yeet.then((value) => {console.log(value)})); 
  
    setInterval(() =>
    {
      const now = new Date()
      for (let i = 0; i < this.game.length; i++)
      {
        console.log("game Id:",this.game[i].id);
        console.log("          status_started   :", this.game[i].started);
        console.log("          status_isOver    :", this.game[i].isOver);
        console.log("          status_isRanked  :", this.game[i].isRanked);
        console.log("          timeRemaining at :", this.game[i].timeRemaining.toFixed(2));
        console.log("          score            : [", this.game[i].scoreUser1, "/", this.game[i].scoreUser2, "]");
        console.log("          pos player       : [", this.game[i].player1_posY, "/", this.game[i].player2_posY, "]");
        console.log("          player power     : [", this.game[i].player1_power.toFixed(1), ",", this.game[i].player2_power.toFixed(1), "]");
        console.log("          player cooldown  : [", this.game[i].player1_powerUpCooldown.toFixed(2), ",", this.game[i].player2_powerUpCooldown.toFixed(2), "]");
        console.log("          pos ball         : [", this.game[i].ball_posX.toFixed(3), ",", this.game[i].ball_posY.toFixed(3), "]");
        console.log("          direction in rds :", this.game[i].ball_direction);
        console.log("          direction in rds%:", this.game[i].ball_direction % 2);
        let radiantOntwo: number = this.game[i].ball_direction % 2;
        while (radiantOntwo < 0)
          radiantOntwo += 2;
        console.log("          direction in rds@:", radiantOntwo);
        console.log("          speed            :", this.game[i].ball_speed);
        console.log("          PowerUp 1 smash  :", this.game[i].player1_powerUpSandevistanSmash, "-->", this.game[i].player1_powerUpSandevistanSmashActive);
        console.log("          PowerUp 1 guard  :", this.game[i].player1_powerUpSandevistanGuard, "-->", this.game[i].player1_powerUpSandevistanGuardActive);
        console.log("          PowerUp 2 smash  :", this.game[i].player2_powerUpSandevistanSmash, "-->", this.game[i].player2_powerUpSandevistanSmashActive);
        console.log("          PowerUp 2 guard  :", this.game[i].player2_powerUpSandevistanGuard, "-->", this.game[i].player2_powerUpSandevistanGuardActive);
        if (this.game[i].isOver)
          this.remove(this.game[i].id);
        else
          this.runningGame(this.game[i], now);
      }
    }, 10);
  }

  // find all active game (will be used for spectate)
  findAll(): Game[] {
    return this.game;
  }

  // find game by game ID (will be used to get info on current game)
  async findById(id: number): Promise<Game | undefined> {
    if (this.game.find((game) => game.id == id))
      return this.game.find((game) => game.id == id);
    else
    {
      const gamePrisma = await this.prisma.game.findUnique({where: { id: Number(id) },});

      if (!gamePrisma)
        return undefined;

      const olderGame: Game = {
        id: gamePrisma.id,
        userId1: gamePrisma.userId1,
        userId2: gamePrisma.userId2,
        isRanked: gamePrisma.isRanked,
        isOver: gamePrisma.isOver,
        scoreUser1: gamePrisma.scoreUser1,
        scoreUser2: gamePrisma.scoreUser2,
        date: gamePrisma.date,
        started: false,
        timeRemaining: 0,
        player1_posY: 0,
        player1_direction: 0,
        player2_posY: 0,
        player2_direction: 0,
        ball_posY: 0,
        ball_posX: 0,
        ball_direction: 0,
        ball_speed: 0,
        player1_power: 0,
        player1_powerUpCooldown: 0,
        player1_powerUpSandevistanSmash: false,
        player1_powerUpSandevistanSmashActive: false,
        player1_powerUpSandevistanGuard: false,
        player1_powerUpSandevistanGuardActive: false,
        player2_power: 0,
        player2_powerUpCooldown: 0,
        player2_powerUpSandevistanSmash: false,
        player2_powerUpSandevistanSmashActive: false,
        player2_powerUpSandevistanGuard: false,
        player2_powerUpSandevistanGuardActive: false,
      }

      return olderGame;
    }
  }

  // find all games for one user (will be used to get game history for one user)
  async findAllForOneUser(id: number): Promise<Game[]>
  {
    const game_1 = this.game.filter((game) => game.userId1 == id || game.userId2 == id);

    const game_2_prisma = await this.prisma.game.findMany(
    {
      where:
      {
        OR:
        [
          { userId1: Number(id) },
          { userId2: Number(id) },
        ],
      },
    });
    
    for (let i = 0; i < game_2_prisma.length; i++)
    {
      if (!game_1.find((game) => game.id == game_2_prisma[i].id))
      {
        const olderGame: Game = {
          id: game_2_prisma[i].id,
          userId1: game_2_prisma[i].userId1,
          userId2: game_2_prisma[i].userId2,
          isRanked: game_2_prisma[i].isRanked,
          isOver: game_2_prisma[i].isOver,
          scoreUser1: game_2_prisma[i].scoreUser1,
          scoreUser2: game_2_prisma[i].scoreUser2,
          date: game_2_prisma[i].date,
          started: true,
          timeRemaining: 0,
          player1_posY: 0,
          player1_direction: 0,
          player2_posY: 0,
          player2_direction: 0,
          ball_posY: 0,
          ball_posX: 0,
          ball_direction: 0,
          ball_speed: 0,
          player1_power: 0,
          player1_powerUpCooldown: 0,
          player1_powerUpSandevistanSmash: false,
          player1_powerUpSandevistanSmashActive: false,
          player1_powerUpSandevistanGuard: false,
          player1_powerUpSandevistanGuardActive: false,
          player2_power: 0,
          player2_powerUpCooldown: 0,
          player2_powerUpSandevistanSmash: false,
          player2_powerUpSandevistanSmashActive: false,
          player2_powerUpSandevistanGuard: false,
          player2_powerUpSandevistanGuardActive: false,
        }
        game_1.push(olderGame);
      }
    }

    return game_1;
  }

  async findLastTenGamesOf(id: number): Promise<Game[]>
  {
    const game_prisma = await this.prisma.game.findMany(
    {
      where:
      {
        OR:
        [
          { userId1: Number(id) },
          { userId2: Number(id) },
        ],
        isOver: true,
      },
      take: 10,
      orderBy:
      {
        id: 'desc'
      }
    });

    if (!game_prisma || game_prisma.length == 0)
      return [];
    
    let game: Game[] = [];
    for (let i: number = 0; i < game_prisma.length; i++)
    {
      let gameToPush: Game = {
        id: game_prisma[i].id,
        userId1: game_prisma[i].userId1,
        userId2: game_prisma[i].userId2,
        isRanked: game_prisma[i].isRanked,
        isOver: game_prisma[i].isOver,
        scoreUser1: game_prisma[i].scoreUser1,
        scoreUser2: game_prisma[i].scoreUser2,
        date: game_prisma[i].date,
        started: true,
        timeRemaining: 0,
        player1_posY: 0,
        player1_direction: 0,
        player2_posY: 0,
        player2_direction: 0,
        ball_posY: 0,
        ball_posX: 0,
        ball_direction: 0,
        ball_speed: 0,
        player1_power: 0,
        player1_powerUpCooldown: 0,
        player1_powerUpSandevistanSmash: false,
        player1_powerUpSandevistanSmashActive: false,
        player1_powerUpSandevistanGuard: false,
        player1_powerUpSandevistanGuardActive: false,
        player2_power: 0,
        player2_powerUpCooldown: 0,
        player2_powerUpSandevistanSmash: false,
        player2_powerUpSandevistanSmashActive: false,
        player2_powerUpSandevistanGuard: false,
        player2_powerUpSandevistanGuardActive: false,
      }
      
      if (gameToPush)
        game.push(gameToPush);
    }

    return game;
  }

  async updatePlayerDirection(id: number, userId: number, PlayerDirection: number) {
    const gameToUpdate = this.game.find((game) => game.id == id);
    if (gameToUpdate && !gameToUpdate.isOver)
    {
      if (PlayerDirection > 1)
        PlayerDirection = 1;
      else if (PlayerDirection < -1)
        PlayerDirection = -1;
      if (gameToUpdate.userId1 == userId)
        gameToUpdate.player1_direction = PlayerDirection;
      else if (userId == gameToUpdate.userId2)
        gameToUpdate.player2_direction = PlayerDirection;
    }
  }

  sandevistanSmash(gameId:number, userId: number)
  {
    const gameToUpdate = this.game.find((game) => game.id == gameId);
    if (gameToUpdate && !gameToUpdate.isOver && gameToUpdate.isRanked == true)
    {
      if (gameToUpdate.userId1 == userId &&
        gameToUpdate.player1_powerUpCooldown == 0 &&
        gameToUpdate.player1_power >= this.powerUpNeededForSandevistanSmash &&
        gameToUpdate.player1_powerUpSandevistanSmash == false)
      {
        gameToUpdate.player1_powerUpSandevistanSmash = true;
        gameToUpdate.player1_powerUpCooldown = this.powerUpCooldownAfterUser;
        gameToUpdate.player1_power -= this.powerUpNeededForSandevistanSmash;
      }
      else if (gameToUpdate.userId2 == userId &&
        gameToUpdate.player2_powerUpCooldown == 0 &&
        gameToUpdate.player2_power >= this.powerUpNeededForSandevistanSmash &&
        gameToUpdate.player2_powerUpSandevistanSmash == false)
      {
        gameToUpdate.player2_powerUpSandevistanSmash = true;
        gameToUpdate.player2_powerUpCooldown = this.powerUpCooldownAfterUser;
        gameToUpdate.player2_power -= this.powerUpNeededForSandevistanSmash;
      }
    }
  }

  sandevistanGuard(gameId:number, userId: number)
  {
    const gameToUpdate = this.game.find((game) => game.id == gameId);
    if (gameToUpdate && !gameToUpdate.isOver && gameToUpdate.isRanked == true)
    {
      if (gameToUpdate.userId1 == userId &&
        gameToUpdate.player1_powerUpCooldown == 0 &&
        gameToUpdate.player1_power >= this.powerUpNeededForSandevistanGuard &&
        gameToUpdate.player1_powerUpSandevistanGuard == false)
      {
        gameToUpdate.player1_powerUpSandevistanGuard = true;
        gameToUpdate.player1_powerUpCooldown = this.powerUpCooldownAfterUser;
        gameToUpdate.player1_power -= this.powerUpNeededForSandevistanGuard;
      }
      else if (gameToUpdate.userId2 == userId &&
        gameToUpdate.player2_powerUpCooldown == 0 &&
        gameToUpdate.player2_power >= this.powerUpNeededForSandevistanGuard &&
        gameToUpdate.player2_powerUpSandevistanGuard == false)
      {
        gameToUpdate.player2_powerUpSandevistanGuard = true;
        gameToUpdate.player2_powerUpCooldown = this.powerUpCooldownAfterUser;
        gameToUpdate.player2_power -= this.powerUpNeededForSandevistanGuard;
      }
    } 
  }

  // create a new game (will be called by matchmaking service to create a game after matching 2 user) and return the game ID
  async createNewGame(userId1: number, userId2: number, isRanked: any): Promise<number>
  {
    if (userId1 == userId2)
    {
      return (0);
    }

    const PrismaUser1 = await this.prisma.user.findUnique({where: { id: Number(userId1) },});
    const PrismaUser2 = await this.prisma.user.findUnique({where: { id: Number(userId2) },});

    if (!PrismaUser1 || !PrismaUser2)
      return (0);

    const randomAngle = Math.floor(Math.random() * 500);
    const randomDirection = Math.floor(Math.random() * 2);
    let randomRadiant: number;

    if (randomDirection == 0)
        randomRadiant = (-0.25 + (randomAngle / 1000));
    else
        randomRadiant = (-0.75 - (randomAngle / 1000));

    const newGamePrisma = await this.prisma.game.create(
    {
      data:
      {
        userId1: Number(userId1),
        userId2: Number(userId2),
        isRanked: Boolean(isRanked), 
      },
    });

    if (!newGamePrisma)
      return (-1);

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
      timeRemaining: this.timeBeforeStart + this.timeRemainingInit,
      player1_posY: 0,
      player1_direction: 0,
      player2_posY: 0,
      player2_direction: 0,
      ball_posY: 0,
      ball_posX: 0,
      ball_direction: randomRadiant,
      ball_speed: this.speedBallInit,
      player1_power: this.powerPlayerInit, // start with 50 power, will be up to 100 and down to 0
      player1_powerUpCooldown: this.powerUpCooldownInit,
      player1_powerUpSandevistanSmash: false,
      player1_powerUpSandevistanSmashActive: false,
      player1_powerUpSandevistanGuard: false,
      player1_powerUpSandevistanGuardActive: false,
      player2_power: this.powerPlayerInit,  // start with 50 power, will be up to 100 and down to 0
      player2_powerUpCooldown: this.powerUpCooldownInit,
      player2_powerUpSandevistanSmash: false,
      player2_powerUpSandevistanSmashActive: false,
      player2_powerUpSandevistanGuard: false,
      player2_powerUpSandevistanGuardActive: false,
    }
    this.game.push(newGame);

    return newGame.id;
  }

  // update a game (is called by constructor clock every 10ms)
  private runningGame(gameToUpdate: Game, now: Date)
  {
    if (gameToUpdate && !gameToUpdate.isOver)
    {
      const elapsedMs = now.getTime() - gameToUpdate.date.getTime();
      gameToUpdate.timeRemaining = gameToUpdate.timeRemaining - (elapsedMs / 1000);
      gameToUpdate.date = now;

      if (!gameToUpdate.started)
        this.startGame(gameToUpdate);
      else if (!gameToUpdate.isOver) 
        this.updateGame(gameToUpdate, elapsedMs);
    }
  }

  private startGame(gameToUpdate: Game)
  {
    if (gameToUpdate.timeRemaining <= this.timeRemainingInit)
      gameToUpdate.started = true;
  }

  private updateGame(gameToUpdate: Game, elapsedMs: number)
  {
    if (gameToUpdate.timeRemaining <= 0)
      this.endGame(gameToUpdate);
    else
    {
      if (gameToUpdate.isRanked == true)
        this.updatePlayerPowerAndCooldown(gameToUpdate, elapsedMs);
      this.updatePlayerPosition(gameToUpdate, elapsedMs);
      this.updatePositionBall(gameToUpdate, elapsedMs);
      this.manageWallCollisionX(gameToUpdate, elapsedMs);
      this.manageWallCollisionY(gameToUpdate);
    }
  }

  private async endGame(gameToUpdate: Game)
  {
    gameToUpdate.timeRemaining = 0;
    gameToUpdate.isOver = true;

    const gameToUpdatePrisma = await this.prisma.game.update(
    {
      where: 
      { 
        id: gameToUpdate.id
      },
      data: 
      {
        isOver: gameToUpdate.isOver,
        scoreUser1: gameToUpdate.scoreUser1,
        scoreUser2: gameToUpdate.scoreUser2,
      },
    });

    if (!gameToUpdatePrisma)
      return ;
  }

  private updatePlayerPosition(gameToUpdate: Game, elapsedMs: number)
  {
    if (gameToUpdate.player1_powerUpSandevistanGuard == false)
      gameToUpdate.player1_posY += gameToUpdate.player1_direction * (elapsedMs / 1000) * this.speedPlayer;
    else
      gameToUpdate.player1_posY += gameToUpdate.player1_direction * (elapsedMs / 1000) * this.speedPlayer * this.SandevistanModificator;

    if (gameToUpdate.player2_powerUpSandevistanGuard == false)
      gameToUpdate.player2_posY += gameToUpdate.player2_direction * (elapsedMs / 1000) * this.speedPlayer;
    else
      gameToUpdate.player2_posY += gameToUpdate.player2_direction * (elapsedMs / 1000) * this.speedPlayer * this.SandevistanModificator;

    this.wallAndPlayerCollision(gameToUpdate);
  }

  private updatePlayerPowerAndCooldown(gameToUpdate: Game, elapsedMs: number)
  {
    if (gameToUpdate.player1_powerUpCooldown > 0)
    {
      gameToUpdate.player1_powerUpCooldown -= elapsedMs / 1000;
      if (gameToUpdate.player1_powerUpCooldown < 0)
        gameToUpdate.player1_powerUpCooldown = 0;
    }
    if (gameToUpdate.player1_power < this.powerPlayerMax)
    {
      gameToUpdate.player1_power += elapsedMs / 1000;
      if (gameToUpdate.player1_power > this.powerPlayerMax)
        gameToUpdate.player1_power = this.powerPlayerMax;
    }

    if (gameToUpdate.player2_powerUpCooldown > 0)
    {
      gameToUpdate.player2_powerUpCooldown -= elapsedMs / 1000;
      if (gameToUpdate.player2_powerUpCooldown < 0)
        gameToUpdate.player2_powerUpCooldown = 0;
    }
    if (gameToUpdate.player2_power < this.powerPlayerMax)
    {
      gameToUpdate.player2_power += elapsedMs / 1000;
      if (gameToUpdate.player2_power > this.powerPlayerMax)
        gameToUpdate.player2_power = this.powerPlayerMax;
    }
  }

  private wallAndPlayerCollision(gameToUpdate: Game)
  {
    if (gameToUpdate.player1_posY >= 0.8)
      gameToUpdate.player1_posY = 0.8;
    else if (gameToUpdate.player1_posY <= -0.8)
      gameToUpdate.player1_posY = -0.8;

    if (gameToUpdate.player2_posY >= 0.8)
      gameToUpdate.player2_posY = 0.8;
    else if (gameToUpdate.player2_posY <= -0.8)
      gameToUpdate.player2_posY = -0.8;
  }

  private updatePositionBall(gameToUpdate: Game, elapsedMs: number)
  {
    let actualSpeed: number = gameToUpdate.ball_speed;
    // v1 < 0.5 || v1 > 1.5
    // v2 > 0.5 && v2 < 1.5
    // randomRadiant = (-0.25 + (randomAngle / 1000)) * Math.PI; -> -0.5 * pi < v1 < 0.5 * pi
    // randomRadiant = (-0.75 - (randomAngle / 1000)) * Math.PI; -> -1.5 * pi < v2 < -0.5

    let radiantOntwo: number = gameToUpdate.ball_direction % 2;
    while (radiantOntwo < 0)
      radiantOntwo += 2;

    if (gameToUpdate.player1_powerUpSandevistanGuard == true && 
      ((radiantOntwo % 2) > 0.5 && (radiantOntwo % 2) < 1.5) &&
      gameToUpdate.ball_posX <= 0)
    {
      gameToUpdate.player1_powerUpSandevistanGuardActive = true;
    }

    if (gameToUpdate.player2_powerUpSandevistanGuard == true &&
      ((radiantOntwo % 2) < 0.5 || (radiantOntwo % 2) > 1.5) &&
      gameToUpdate.ball_posX >= 0)
    {
      gameToUpdate.player2_powerUpSandevistanGuardActive = true;
    }

    if (gameToUpdate.player1_powerUpSandevistanSmashActive || gameToUpdate.player2_powerUpSandevistanSmashActive)
      actualSpeed *= this.SandevistanModificator;

    if (gameToUpdate.player1_powerUpSandevistanGuardActive || gameToUpdate.player2_powerUpSandevistanGuardActive)
      actualSpeed /= this.SandevistanModificator;

    gameToUpdate.ball_posX += Math.cos(gameToUpdate.ball_direction * Math.PI) * (elapsedMs / 1000) * actualSpeed;
    gameToUpdate.ball_posY += Math.sin(gameToUpdate.ball_direction * Math.PI) * (elapsedMs / 1000) * actualSpeed;
  }

  private manageWallCollisionY(gameToUpdate: Game)
  {
    if (gameToUpdate.ball_posY >= 1 || gameToUpdate.ball_posY <= -1)
    {
      gameToUpdate.ball_direction = -gameToUpdate.ball_direction;
      gameToUpdate.ball_speed *= this.speedBallHitWallModificator;

      if (gameToUpdate.ball_posY >= 1)
        gameToUpdate.ball_posY = 1 - (gameToUpdate.ball_posY - 1);
      else if (gameToUpdate.ball_posY <= -1)
        gameToUpdate.ball_posY = -1 - (gameToUpdate.ball_posY + 1);
    }
  }

  private manageWallCollisionX(gameToUpdate: Game, elapsedMs: number)
  {
    if (gameToUpdate.ball_posX >= 1 || gameToUpdate.ball_posX <= -1.0)
    {
      if (gameToUpdate.isRanked == true)
        this.desactivationOfPowerUp(gameToUpdate);

      if ((gameToUpdate.ball_posX >= 1 && 
        gameToUpdate.player2_posY + 0.2 >= gameToUpdate.ball_posY &&
        gameToUpdate.player2_posY - 0.2 <= gameToUpdate.ball_posY) || (
        gameToUpdate.ball_posX <= -1.0 &&
        gameToUpdate.player1_posY + 0.2 >= gameToUpdate.ball_posY &&
        gameToUpdate.player1_posY - 0.2 <= gameToUpdate.ball_posY))
      {
        this.playerColisionManagement(gameToUpdate, elapsedMs);
      }
      else
        this.newPoint(gameToUpdate);
    }
  }

  private newPoint(gameToUpdate: Game)
  {
    let randomRadiant: number;
    const randomAngle = Math.floor(Math.random() * 500);

    if (gameToUpdate.ball_posX >= 1)
    {
      gameToUpdate.scoreUser1 += 1;
      // gameToUpdate.player1_power += this.powerModificationWhenScoring;
      // gameToUpdate.player2_power -= this.powerModificationWhenHit;
      randomRadiant = (-0.25 + (randomAngle / 1000));
    }
    else
    {
      gameToUpdate.scoreUser2 += 1;
      // gameToUpdate.player2_power += this.powerModificationWhenScoring;
      // gameToUpdate.player1_power -= this.powerModificationWhenHit;
      randomRadiant = (-0.75 - (randomAngle / 1000));
    }

    gameToUpdate.ball_speed = this.speedBallInit;
    gameToUpdate.ball_posX = 0;
    gameToUpdate.ball_posY = 0;
    gameToUpdate.ball_direction = randomRadiant;
    gameToUpdate.player1_powerUpCooldown = this.powerUpCooldownInit;
    gameToUpdate.player2_powerUpCooldown = this.powerUpCooldownInit;
  }

  private desactivationOfPowerUp(gameToUpdate: Game)
  {
    if (gameToUpdate.player1_powerUpSandevistanSmashActive == true)
    {
      gameToUpdate.player1_powerUpSandevistanSmashActive = false;
      gameToUpdate.player1_powerUpSandevistanSmash = false;
    }

    if (gameToUpdate.player2_powerUpSandevistanSmashActive == true)
    {
      gameToUpdate.player2_powerUpSandevistanSmashActive = false;
      gameToUpdate.player2_powerUpSandevistanSmash = false;
    }

    if (gameToUpdate.player1_powerUpSandevistanGuardActive == true)
    {
      gameToUpdate.player1_powerUpSandevistanGuardActive = false;
      gameToUpdate.player1_powerUpSandevistanGuard = false;
    }

    if (gameToUpdate.player2_powerUpSandevistanGuardActive == true)
    {
      gameToUpdate.player2_powerUpSandevistanGuardActive = false;
      gameToUpdate.player2_powerUpSandevistanGuard = false;
    }
  }

  private playerColisionManagement(gameToUpdate: Game, elapsedMs: number)
  {
    let playerDistanceWithBall: number;
    let playerImpactModificator: number;

    gameToUpdate.ball_speed *= this.speedBallHitPlayerModificator;

    if (gameToUpdate.ball_posX >= 1)
    {
      playerDistanceWithBall = gameToUpdate.player2_posY - gameToUpdate.ball_posY;
      playerImpactModificator = playerDistanceWithBall;
      gameToUpdate.ball_direction = 1 - gameToUpdate.ball_direction + playerImpactModificator;
      gameToUpdate.ball_posX = 1 - (gameToUpdate.ball_posX - 1);

      if (gameToUpdate.player2_powerUpSandevistanSmash == true)
        gameToUpdate.player2_powerUpSandevistanSmashActive = true;
    } 
    else if (gameToUpdate.ball_posX <= -1)
    {
      playerDistanceWithBall = gameToUpdate.player1_posY - gameToUpdate.ball_posY;
      playerImpactModificator = playerDistanceWithBall;
      gameToUpdate.ball_direction = 1 - gameToUpdate.ball_direction - playerImpactModificator;
      gameToUpdate.ball_posX = -1 - (gameToUpdate.ball_posX + 1);

      if (gameToUpdate.player1_powerUpSandevistanSmash == true)
        gameToUpdate.player1_powerUpSandevistanSmashActive = true;
    }
  }

  // remove a game specified with a game ID : will be called after a game is over (this don't delete the game in the ddb)
  private remove(id: number): void
  {
    this.game = this.game.filter((game) => game.id !== id);
  }
}