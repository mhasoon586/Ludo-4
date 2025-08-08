import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import Dice from './components/Dice';
import { GameState, PlayerColor, PawnState, PawnPosition } from './types';
import { PLAYERS, PLAYER_COLORS_HEX, START_SPOTS, HOME_ENTRY_POINTS, REFINED_SAFE_SPOTS } from './constants';

// Helper function to calculate a pawn's next position.
// Returns a valid new position (number, string) or null if the move is not possible.
const calculateNewPosition = (pawn: PawnState, roll: number): PawnPosition | null => {
    const { position, color } = pawn;

    if (position === 'FINISHED') {
        return null; // Cannot move a finished pawn
    }

    // Case 1: Pawn is in the home base
    if (position === 'HOME' || (typeof position === 'string' && position.startsWith('HOME_'))) {
        // Can only move out on a 1 or a 6
        return (roll === 1 || roll === 6) ? START_SPOTS[color] : null;
    }

    // Case 2: Pawn is in its final home row (e.g., 'R1', 'G3')
    if (typeof position === 'string') {
        const currentHomePos = parseInt(position.slice(1));
        const newHomePos = currentHomePos + roll;
        if (newHomePos < 6) {
            return `${color.charAt(0)}${newHomePos}`;
        }
        if (newHomePos === 6) {
            return 'FINISHED';
        }
        return null; // Overshot the finish line
    }
    
    // Case 3: Pawn is on the main track
    if (typeof position === 'number') {
        const currentPos = position;
        const homeEntry = HOME_ENTRY_POINTS[color];

        let isApproachingHome = false;
        
        if (color !== PlayerColor.RED) {
             if (currentPos <= homeEntry && currentPos + roll > homeEntry) {
                isApproachingHome = true;
             }
        } else { // Special check for RED (entry 51) which wraps around the board
             if (currentPos <= homeEntry && (currentPos + roll) > homeEntry) {
                isApproachingHome = true;
             }
        }
        
        if (isApproachingHome) {
            const stepsToEntry = homeEntry - currentPos;
            const stepsIntoHome = roll - stepsToEntry;

            if (stepsIntoHome > 6) {
                return null; // Overshot
            }
            if (stepsIntoHome === 6) {
                return 'FINISHED';
            }
            // stepsIntoHome will be between 1 and 5
            return `${color.charAt(0)}${stepsIntoHome}`;
        } else {
            // Standard move on the track
            return (currentPos + roll) % 52;
        }
    }

    return null; // Should not be reached in normal flow
};


const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);
    const [pawns, setPawns] = useState<PawnState[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [diceValue, setDiceValue] = useState(6);
    const [isRolling, setIsRolling] = useState(false);
    const [winner, setWinner] = useState<PlayerColor | null>(null);
    const [message, setMessage] = useState('Welcome to Ludo! Press Start Game.');
    const [hasRolled, setHasRolled] = useState(false);

    const initializeGame = useCallback(() => {
        const initialPawns: PawnState[] = [];
        PLAYERS.forEach((player, playerIndex) => {
            for (let i = 0; i < 4; i++) {
                initialPawns.push({
                    id: playerIndex * 4 + i,
                    color: player.color,
                    position: 'HOME',
                });
            }
        });
        setPawns(initialPawns);
        setCurrentPlayerIndex(0);
        setDiceValue(1);
        setGameState(GameState.IN_PROGRESS);
        setWinner(null);
        setHasRolled(false);
        setMessage(`${PLAYERS[0].name}'s turn. Roll the dice!`);
    }, []);
    
    useEffect(() => {
        initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentPlayerColor = PLAYERS[currentPlayerIndex].color;

    const nextTurn = useCallback((wasExtraTurn: boolean) => {
        if (wasExtraTurn) {
            setMessage(`${PLAYERS[currentPlayerIndex].name} gets an extra turn! Roll again.`);
            setHasRolled(false);
            setPawns(prev => prev.map(p => ({ ...p, isMovable: false })));
        } else {
            const nextIndex = (currentPlayerIndex + 1) % PLAYERS.length;
            setCurrentPlayerIndex(nextIndex);
            setMessage(`${PLAYERS[nextIndex].name}'s turn. Roll the dice!`);
            setHasRolled(false);
            setPawns(prev => prev.map(p => ({ ...p, isMovable: false })));
        }
    }, [currentPlayerIndex]);

    const checkForWinner = useCallback((currentPawns: PawnState[]) => {
        const finishedCount = currentPawns.filter(p => p.color === currentPlayerColor && p.position === 'FINISHED').length;
        if (finishedCount === 4) {
            setGameState(GameState.GAME_OVER);
            setWinner(currentPlayerColor);
            setMessage(`${currentPlayerColor} wins the game! Congratulations!`);
            return true;
        }
        return false;
    }, [currentPlayerColor]);

    const findMovablePawns = useCallback((roll: number) => {
        const myPawns = pawns.filter(p => p.color === currentPlayerColor);
        const movablePawns = myPawns.filter(pawn => calculateNewPosition(pawn, roll) !== null);

        if (movablePawns.length > 0) {
            setPawns(prev => prev.map(p => movablePawns.some(mp => mp.id === p.id) ? { ...p, isMovable: true } : p));
            setMessage('Select a pawn to move.');
        } else {
            setMessage('No possible moves. Next player.');
            setTimeout(() => nextTurn(roll === 6), 1000);
        }
    }, [pawns, currentPlayerColor, nextTurn]);

    const movePawn = useCallback((pawnId: number) => {
        const pawnToMove = pawns.find(p => p.id === pawnId);
        if (!pawnToMove || !pawnToMove.isMovable) return;

        const newPosition = calculateNewPosition(pawnToMove, diceValue);
        if (newPosition === null) {
            // This should not happen if findMovablePawns worked correctly
            console.error("Invalid move selected. This should have been filtered out.");
            return;
        }

        let extraTurn = false;
        let updatedPawns = pawns.map(p => p.id === pawnId ? { ...p, position: newPosition } : p);
        
        // Check for captures
        if (typeof newPosition === 'number' && !REFINED_SAFE_SPOTS.includes(newPosition)) {
            const pawnsAtDestination = updatedPawns.filter(p => p.position === newPosition && p.color !== pawnToMove.color);
            if (pawnsAtDestination.length === 1) {
                updatedPawns = updatedPawns.map(p => p.id === pawnsAtDestination[0].id ? { ...p, position: 'HOME' } : p);
                extraTurn = true;
                setMessage('Pawn captured! Extra turn!');
            }
        }
        
        setPawns(updatedPawns.map(p => ({...p, isMovable: false})));

        if (checkForWinner(updatedPawns)) return;
        
        if (diceValue === 6 || extraTurn) {
            nextTurn(true);
        } else {
            nextTurn(false);
        }
    }, [pawns, diceValue, checkForWinner, nextTurn, currentPlayerColor]);

    const handleRollDice = () => {
        if (isRolling || hasRolled || gameState !== GameState.IN_PROGRESS) return;
        setIsRolling(true);
        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            setDiceValue(roll);
            setIsRolling(false);
            setHasRolled(true);
            findMovablePawns(roll);
        }, 500);
    };

    const pawnsForBoard = pawns.map(p => ({...p}));
    // Distribute pawns in home base for rendering
    Object.values(PlayerColor).forEach(color => {
        const homePawns = pawns.filter(p => p.color === color && p.position === 'HOME');
        homePawns.forEach((pawn, index) => {
            const pawnToUpdate = pawnsForBoard.find(p => p.id === pawn.id);
            if(pawnToUpdate) pawnToUpdate.position = `HOME_${color}_${index}`;
        });
    });

    const getFinishedCount = (color: PlayerColor) => pawns.filter(p => p.color === color && p.position === 'FINISHED').length;
    
    return (
        <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-around gap-8">
                
                <div className="w-full lg:w-auto flex flex-col items-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-indigo-400">Ludo Classic</h1>
                    
                    {gameState === GameState.IN_PROGRESS && (
                        <div className={`p-4 rounded-lg shadow-lg text-center ${PLAYER_COLORS_HEX[currentPlayerColor].dark} ${PLAYER_COLORS_HEX[currentPlayerColor].text} transition-colors duration-300`}>
                            <h2 className="text-2xl font-semibold">{PLAYERS[currentPlayerIndex].name}'s Turn</h2>
                            <p className="mt-2 text-lg min-h-[28px]">{message}</p>
                        </div>
                    )}

                    {gameState === GameState.GAME_OVER && winner && (
                         <div className={`p-4 rounded-lg shadow-lg text-center ${PLAYER_COLORS_HEX[winner].dark} ${PLAYER_COLORS_HEX[winner].text}`}>
                            <h2 className="text-3xl font-bold">Game Over!</h2>
                            <p className="mt-2 text-xl">{message}</p>
                        </div>
                    )}

                    {gameState !== GameState.IN_PROGRESS ? (
                        <button onClick={initializeGame} className="px-8 py-4 bg-green-600 text-white font-bold text-xl rounded-lg shadow-md hover:bg-green-700 transition-all">
                            {gameState === GameState.NOT_STARTED ? 'Start Game' : 'Play Again'}
                        </button>
                    ) : (
                        <Dice value={diceValue} isRolling={isRolling} onRoll={handleRollDice} canRoll={!hasRolled} />
                    )}

                     <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
                        {PLAYERS.map(player => (
                            <div key={player.color} className={`p-3 rounded-md ${PLAYER_COLORS_HEX[player.color].light} ${PLAYER_COLORS_HEX[player.color].text} flex justify-between items-center shadow-lg`}>
                                <span className="font-bold">{player.name}</span>
                                <span className="font-mono text-sm bg-black/20 px-2 py-1 rounded">
                                    {getFinishedCount(player.color)}/4
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl aspect-square p-2">
                    <Board pawns={pawnsForBoard} onPawnClick={movePawn} />
                </div>

            </div>
        </div>
    );
};

export default App;
