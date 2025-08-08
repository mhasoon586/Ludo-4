
import React from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRoll: () => void;
  canRoll: boolean;
}

const Dot: React.FC<{ position: string }> = ({ position }) => (
  <div className={`w-3 h-3 md:w-5 md:h-5 bg-gray-800 rounded-full absolute ${position}`}></div>
);

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRoll, canRoll }) => {
  const dotPatterns: { [key: number]: React.ReactNode[] } = {
    1: [<Dot key="1" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />],
    2: [<Dot key="1" position="top-1/4 left-1/4" />, <Dot key="2" position="bottom-1/4 right-1/4" />],
    3: [<Dot key="1" position="top-1/4 left-1/4" />, <Dot key="2" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />, <Dot key="3" position="bottom-1/4 right-1/4" />],
    4: [<Dot key="1" position="top-1/4 left-1/4" />, <Dot key="2" position="top-1/4 right-1/4" />, <Dot key="3" position="bottom-1/4 left-1/4" />, <Dot key="4" position="bottom-1/4 right-1/4" />],
    5: [<Dot key="1" position="top-1/4 left-1/4" />, <Dot key="2" position="top-1/4 right-1/4" />, <Dot key="3" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />, <Dot key="4" position="bottom-1/4 left-1/4" />, <Dot key="5" position="bottom-1/4 right-1/4" />],
    6: [<Dot key="1" position="top-1/4 left-1/4" />, <Dot key="2" position="top-1/4 right-1/4" />, <Dot key="3" position="top-1/2 left-1/4 -translate-y-1/2" />, <Dot key="4" position="top-1/2 right-1/4 -translate-y-1/2" />, <Dot key="5" position="bottom-1/4 left-1/4" />, <Dot key="6" position="bottom-1/4 right-1/4" />],
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative w-20 h-20 md:w-28 md:h-28 bg-white rounded-2xl shadow-lg border-2 border-gray-300 flex items-center justify-center transition-transform duration-500 ${isRolling ? 'animate-spin' : ''}`}
      >
        {dotPatterns[value]}
      </div>
      <button
        onClick={onRoll}
        disabled={!canRoll || isRolling}
        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
};

export default Dice;
