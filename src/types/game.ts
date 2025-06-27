export interface Cell {
  symbol: string;
  color: string;
  id: string;
}

export interface GameState {
  score: number;
  timeLeft: number;
  movesLeft: number;
  gameActive: boolean;
  gamePaused: boolean;
  level: number;
}

export interface Position {
  row: number;
  col: number;
}