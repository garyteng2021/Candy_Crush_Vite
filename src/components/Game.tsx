import React, { useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import { GameHeader } from './GameHeader';
import { GameStats } from './GameStats';
import { GameControls } from './GameControls';
import { GameCanvas } from './GameCanvas';
import { GameOverModal } from './GameOverModal';
import { Leaderboard } from './Leaderboard';
import { Cell } from '../types/game';

export function Game() {
  const {
    gameState,
    userData,
    gameResponse,
    initGame,
    startGame,
    pauseGame,
    resumeGame,
    attemptSwap,
    setGameState
  } = useGame();

  const handleCellInteraction = useCallback((from: Cell, to: Cell) => {
    attemptSwap(from, to);
  }, [attemptSwap]);

  const handleCellSelect = useCallback((cell: Cell | null) => {
    setGameState(prev => ({ ...prev, selectedCell: cell }));
  }, [setGameState]);

  const handleDragStart = useCallback((cell: Cell | null) => {
    setGameState(prev => ({ ...prev, dragStart: cell }));
  }, [setGameState]);

  const handleRestart = useCallback(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-2xl w-full">
        <GameHeader 
          userData={userData} 
          points={gameResponse?.points} 
          token={gameResponse?.token} 
        />
        
        <GameStats 
          score={gameState.score}
          timeLeft={gameState.timeLeft}
          movesLeft={gameState.movesLeft}
        />
        
        <GameControls
          gameActive={gameState.gameActive}
          gamePaused={gameState.gamePaused}
          onStart={startGame}
          onPause={pauseGame}
          onResume={resumeGame}
          onRestart={handleRestart}
        />
        
        <GameCanvas
          gameState={gameState}
          onCellInteraction={handleCellInteraction}
          onCellSelect={handleCellSelect}
          onDragStart={handleDragStart}
        />
        
        <Leaderboard />
        
        <GameOverModal
          isOpen={!gameState.gameActive && gameState.score > 0}
          score={gameState.score}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}