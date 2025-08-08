
import React from 'react';
import { PlayerColor } from '../types';
import { PLAYER_COLORS_HEX } from '../constants';

interface PawnProps {
  color: PlayerColor;
  isMovable: boolean;
  onClick: () => void;
}

const Pawn: React.FC<PawnProps> = ({ color, isMovable, onClick }) => {
  const colorScheme = PLAYER_COLORS_HEX[color];
  const pulseClass = isMovable ? 'animate-pulse cursor-pointer ring-4 ring-white ring-opacity-75' : '';
  const interactiveClass = isMovable ? 'cursor-pointer' : 'cursor-default';

  return (
    <div
      onClick={isMovable ? onClick : undefined}
      className={`w-full h-full rounded-full ${colorScheme.dark} ${colorScheme.border} border-2 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 ${pulseClass} ${interactiveClass}`}
    >
      <div className={`w-3/5 h-3/5 rounded-full ${colorScheme.light}`}></div>
    </div>
  );
};

export default Pawn;
