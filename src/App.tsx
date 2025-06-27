import React from 'react';
import { GameBoard } from './components/GameBoard';
import Leaderboard from './components/Leaderboard';
import GameOverModal from './components/GameOverModal';
import { useGameLogic } from './utils/gameLogic';
import { Play, Pause, RotateCcw, Clock, Target, Zap } from 'lucide-react';

const App: React.FC = () => {
  const {
    gameActive,
    gamePaused,
    gameOver,
    timeLeft,
    score,
    movesLeft,
    level,
    toggleGame,
    initGame,
    board,
    selectedCell,
    handleCellClick
  } = useGameLogic();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGameButtonText = () => {
    if (!gameActive) return 'Start Game';
    return gamePaused ? 'Resume' : 'Pause';
  };

  const getGameButtonIcon = () => {
    if (!gameActive) return <Play className="w-5 h-5" />;
    return gamePaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="game-container">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            🍭 Candy Crush
          </h1>
          <p className="text-white/80 text-lg">Match 3 or more candies to score!</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-sm opacity-80">Score</span>
            </div>
            <div className="text-xl font-bold">{score.toLocaleString()}</div>
          </div>
          
          <div className="stat-card text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm opacity-80">Time</span>
            </div>
            <div className="text-xl font-bold">{formatTime(timeLeft)}</div>
          </div>
          
          <div className="stat-card text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm opacity-80">Moves</span>
            </div>
            <div className="text-xl font-bold">{movesLeft}</div>
          </div>
          
          <div className="stat-card text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-sm opacity-80">Level</span>
            </div>
            <div className="text-xl font-bold">{level}</div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            className="game-button flex items-center gap-2"
            onClick={toggleGame}
          >
            {getGameButtonIcon()}
            {getGameButtonText()}
          </button>
          
          <button
            className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-full 
                     border border-white/30 hover:border-white/50 transition-all duration-200 
                     flex items-center gap-2"
            onClick={initGame}
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
        </div>

        {/* Game Board */}
        <GameBoard
          board={board}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
          disabled={!gameActive || gamePaused}
        />

        {/* Game Status */}
        {!gameActive && !gameOver && (
          <div className="text-center mb-8">
            <p className="text-white/70 text-lg">
              Click "Start Game" to begin your sweet adventure!
            </p>
          </div>
        )}

        {gamePaused && gameActive && (
          <div className="text-center mb-8">
            <p className="text-white/70 text-lg">Game Paused</p>
          </div>
        )}

        {/* Leaderboard */}
        <Leaderboard />

        {/* Game Over Modal */}
        <GameOverModal 
          score={score} 
          onRestart={initGame} 
          visible={gameOver}
        />
      </div>
    </div>
  );
};

export default App;