export class CreateGameDto {
  id: number;
  userId1: number;
  userId2: number;
  isRanked: boolean;
  isOver: boolean;
  scorePlayer1: number;
  scorePlayer2: number;
  date: string;
  // BELOW NOT IN THE DB
  player1_posY: number; // vertical position beetween -1 (down the game area) and 1 (top the game area)
  player2_posY: number; // same but for player 2
  ball_posY: number; // Same as player but for the ball position
  ball_posX: number; // Same but for horizontal position -1 (left) and 1 (right)
  ball_directionY: number; // direction
  ball_directionX: number; // direction
}