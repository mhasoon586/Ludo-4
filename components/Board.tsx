import React from 'react';
import { PawnState, PlayerColor, PawnPosition } from '../types';
import {
  BOARD_SIZE,
  PLAYER_COLORS_HEX,
  TRACK_COORDS,
  HOME_ROW_MAP,
  HOME_BASE_MAP,
  REFINED_SAFE_SPOTS,
  START_SPOTS,
  HOME_TRIANGLE_MAP
} from '../constants';
import Pawn from './Pawn';

interface BoardProps {
  pawns: PawnState[];
  onPawnClick: (pawnId: number) => void;
}

const StarIcon: React.FC = () => (
    <svg className="w-full h-full p-1 text-yellow-500 opacity-80" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const Board: React.FC<BoardProps> = ({ pawns, onPawnClick }) => {
  const cells = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => i);

  const getPawnsAtCoord = (row: number, col: number): PawnState[] => {
    return pawns.filter(pawn => {
      if (pawn.position.type === 'track') {
        const [trackRow, trackCol] = TRACK_COORDS[pawn.position.index];
        return trackRow === row && trackCol === col;
      }
      if (pawn.position.type === 'home_row') {
        const [homeRow, homeCol] = HOME_ROW_MAP[pawn.color][pawn.position.index];
        return homeRow === row && homeCol === col;
      }
      if (pawn.position.type === 'home_base') {
        const [baseRow, baseCol] = HOME_BASE_MAP[pawn.color][pawn.position.index];
        return baseRow === row && baseCol === col;
      }
      if (pawn.position.type === 'home_triangle') {
        const [triangleRow, triangleCol] = HOME_TRIANGLE_MAP[pawn.color];
        return triangleRow === row && triangleCol === col;
      }
      return false;
    });
  };

  const getCellStylingClass = (row: number, col: number): string => {
    // Center home triangles
    if ((row === 6 && col === 7) || (row === 7 && col === 8) || (row === 8 && col === 7) || (row === 7 && col === 6)) {
        if(row === 6 && col === 7) return PLAYER_COLORS_HEX.GREEN.light;
        if(row === 7 && col === 8) return PLAYER_COLORS_HEX.YELLOW.light;
        if(row === 8 && col === 7) return PLAYER_COLORS_HEX.BLUE.light;
        if(row === 7 && col === 6) return PLAYER_COLORS_HEX.RED.light;
    }
    if (row === 7 && col === 7) return 'bg-gradient-to-br from-yellow-400 to-orange-500';

    // Player home bases
    if (row < 6 && col < 6) return `${PLAYER_COLORS_HEX.RED.light} border-red-300`;
    if (row < 6 && col > 8) return `${PLAYER_COLORS_HEX.GREEN.light} border-green-300`;
    if (row > 8 && col < 6) return `${PLAYER_COLORS_HEX.BLUE.light} border-blue-300`;
    if (row > 8 && col > 8) return `${PLAYER_COLORS_HEX.YELLOW.light} border-yellow-300`;

    // Track, home paths, and safe spots
    for (const color of Object.values(PlayerColor)) {
      if (HOME_ROW_MAP[color].some(([r, c]) => r === row && c === col)) {
        return PLAYER_COLORS_HEX[color].light;
      }
    }

    const trackIndex = TRACK_COORDS.findIndex(([r, c]) => r === row && c === col);
    if (trackIndex !== -1) {
        if (Object.values(START_SPOTS).some((spot, i) => spot === trackIndex)) {
            const colorKey = Object.keys(START_SPOTS).find(k => START_SPOTS[k as PlayerColor] === trackIndex) as PlayerColor;
            return `${PLAYER_COLORS_HEX[colorKey].light} ring-2 ring-white`;
        }
        return 'bg-gray-100 hover:bg-gray-200 transition-colors';
    }

    return 'bg-gray-300';
  };

  return (
    <div className="grid grid-cols-15 grid-rows-15 w-full h-full aspect-square shadow-2xl border-4 border-gray-800 bg-gray-400 rounded-lg overflow-hidden">
      {cells.map(i => {
        const row = Math.floor(i / BOARD_SIZE);
        const col = i % BOARD_SIZE;
        const pawnsOnCell = getPawnsAtCoord(row, col);
        const cellBgClass = getCellStylingClass(row, col);
        const trackIndex = TRACK_COORDS.findIndex(([r, c]) => r === row && c === col);
        const isSafe = trackIndex !== -1 && REFINED_SAFE_SPOTS.includes(trackIndex);

        return (
          <div key={i} className={`${cellBgClass} border border-gray-500/30 relative flex items-center justify-center transition-all duration-200`}>
            {isSafe && <div className="absolute inset-0"><StarIcon /></div>}
            {pawnsOnCell.length > 0 && (
              <div className={`absolute inset-0.5 grid ${pawnsOnCell.length > 1 ? 'grid-cols-2 grid-rows-2 p-px gap-px' : 'p-1'}`}>
                {pawnsOnCell.map(pawn => (
                  <Pawn key={pawn.id} color={pawn.color} isMovable={!!pawn.isMovable} onClick={() => onPawnClick(pawn.id)} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default trackIndex

export default Board;