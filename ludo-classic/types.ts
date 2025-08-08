
export enum PlayerColor {
  RED = 'RED',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
}

export enum GameState {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  GAME_OVER = 'GAME_OVER',
}

// Position can be a number for board index, or a string for special locations
export type PawnPosition = number | string;

export interface PawnState {
  id: number;
  color: PlayerColor;
  position: PawnPosition;
  isMovable?: boolean;
}

export interface Player {
  color: PlayerColor;
  name: string;
}
