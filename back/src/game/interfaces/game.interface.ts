export interface Game
{
  id: number;
  userId1: number; // left player
  userId2: number; // right player
  isRanked: boolean; // did this game is ranked
  isOver: boolean;
  scoreUser1: number;
  scoreUser2: number;
  date: Date;
  // BELOW NOT IN THE DB
  started: boolean;
  timeRemaining: number;

  player1_posY: number; // vertical position beetween -1 (down the game area) and 1 (top the game area)
  player1_direction: number; // direction of the player 1 : 1 = down, 0 = stop, -1 = up
  player2_posY: number; // same but for player 2
  player2_direction: number; // direction of the player 2 : 1 = down, 0 = stop, -1 = up

  ball_posY: number; // Same as player but for the ball position
  ball_posX: number; // Same but for horizontal position -1 (left) and 1 (right)
  ball_speed: number; // speed of the ball
  ball_direction: number; // direction of the ball (in radian)

  player1_power: number; // power of the player 1 (start at 50, mat at 100, minus at 0 (can't exeed those values)))
  player1_powerUpCooldown: number; // shared cooldown of the 2 powerup for player 1 0s to 5s
  player1_powerUpSandevistanSmash: boolean; // powerup smash of the player 1 is active (active next time player 1 hit a ball, until player 2 hit the ball)
  player1_powerUpSandevistanSmashActive: boolean; // needed boolean for player1_powerUpSmash
  player1_powerUpSandevistanGuard: boolean; // powerup guard of the player 1 is active (active at press until player 1 hit the ball)
  player1_powerUpSandevistanGuardActive: boolean; // needed boolean for player1_powerUpGuard

  player2_power: number; // power of the player 2 (start at 50, mat at 100, minus at 0 (can't exeed those values)))
  player2_powerUpCooldown: number; // shared cooldown of the 2 powerup for player 1 0s to 5s
  player2_powerUpSandevistanSmash: boolean; // powerup smash of the player 2 is active (active next time player 2 hit a ball, until player 1 hit the ball)
  player2_powerUpSandevistanSmashActive: boolean; // needed boolean for player2_powerUpSmash
  player2_powerUpSandevistanGuard: boolean; // powerup guard of the player 2 is active (active at press until player 2 hit the ball)
  player2_powerUpSandevistanGuardActive: boolean; // needed boolean for player1_powerUpGuard
}