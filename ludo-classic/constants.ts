
import { PlayerColor } from './types';

export const PLAYERS = [
  { color: PlayerColor.RED, name: 'Player 1' },
  { color: PlayerColor.GREEN, name: 'Player 2' },
  { color: PlayerColor.YELLOW, name: 'Player 3' },
  { color: PlayerColor.BLUE, name: 'Player 4' },
];

export const PLAYER_COLORS_HEX: Record<PlayerColor, { light: string, dark: string, text: string, border: string }> = {
  [PlayerColor.RED]: { light: 'bg-red-400', dark: 'bg-red-600', text: 'text-white', border: 'border-red-800' },
  [PlayerColor.GREEN]: { light: 'bg-green-400', dark: 'bg-green-600', text: 'text-white', border: 'border-green-800' },
  [PlayerColor.YELLOW]: { light: 'bg-yellow-400', dark: 'bg-yellow-600', text: 'text-black', border: 'border-yellow-800' },
  [PlayerColor.BLUE]: { light: 'bg-blue-400', dark: 'bg-blue-600', text: 'text-white', border: 'border-blue-800' },
};

export const BOARD_SIZE = 15;

// The main 52-square track coordinates on the 15x15 grid.
export const TRACK_COORDS: [number, number][] = [
    [6,1], [6,2], [6,3], [6,4], [6,5],             // 0-4
    [5,6], [4,6], [3,6], [2,6], [1,6], [0,6],      // 5-10
    [0,7],                                         // 11
    [0,8], [1,8], [2,8], [3,8], [4,8], [5,8],      // 12-17
    [6,9], [6,10], [6,11], [6,12], [6,13], [6,14], // 18-23
    [7,14],                                        // 24
    [8,14], [8,13], [8,12], [8,11], [8,10], [8,9], // 25-30
    [9,8], [10,8], [11,8], [12,8], [13,8], [14,8], // 31-36
    [14,7],                                        // 37
    [14,6], [13,6], [12,6], [11,6], [10,6], [9,6], // 38-43
    [8,5], [8,4], [8,3], [8,2], [8,1], [8,0],      // 44-49
    [7,0],                                         // 50
    [6,0],                                         // 51
];

export const HOME_ROW_MAP: Record<PlayerColor, [number, number][]> = {
  [PlayerColor.RED]: [[7,1], [7,2], [7,3], [7,4], [7,5]],
  [PlayerColor.GREEN]: [[1,7], [2,7], [3,7], [4,7], [5,7]],
  [PlayerColor.YELLOW]: [[7,13], [7,12], [7,11], [7,10], [7,9]],
  [PlayerColor.BLUE]: [[13,7], [12,7], [11,7], [10,7], [9,7]],
};

export const HOME_TRIANGLE_MAP: Record<PlayerColor, [number, number]> = {
    [PlayerColor.RED]: [7,6],
    [PlayerColor.GREEN]: [6,7],
    [PlayerColor.YELLOW]: [7,8],
    [PlayerColor.BLUE]: [8,7],
};

export const HOME_BASE_MAP: Record<PlayerColor, [number, number][]> = {
  [PlayerColor.RED]: [[1,1], [1,4], [4,1], [4,4]],
  [PlayerColor.GREEN]: [[1,10], [1,13], [4,10], [4,13]],
  [PlayerColor.YELLOW]: [[10,10], [10,13], [13,10], [13,13]],
  [PlayerColor.BLUE]: [[10,1], [10,4], [13,1], [13,4]],
};

export const START_SPOTS: Record<PlayerColor, number> = {
  [PlayerColor.RED]: 0,
  [PlayerColor.GREEN]: 13,
  [PlayerColor.YELLOW]: 26,
  [PlayerColor.BLUE]: 39,
};

export const HOME_ENTRY_POINTS: Record<PlayerColor, number> = {
  [PlayerColor.RED]: 51,
  [PlayerColor.GREEN]: 12,
  [PlayerColor.YELLOW]: 25,
  [PlayerColor.BLUE]: 38,
};

export const REFINED_SAFE_SPOTS = [
  START_SPOTS.RED, START_SPOTS.GREEN, START_SPOTS.YELLOW, START_SPOTS.BLUE,
  8, 21, 34, 47,
];
