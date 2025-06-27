import React from 'react';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/Leaderboard';
import GameOverModal from './components/GameOverModal';
import useTelegram from './hooks/useTelegram';
import { useGameLogic } from './hooks/gameLogic';

const App: React.FC = () => {
  const userId = useTelegram();
  const {
    gameActive,
    gamePaused,
    timeLeft,
    score,
    movesLeft,
    toggleGame,
    initGame,
  } = useGameLogic();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 text-white">
      <div className="game-container bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl max-w-xl w-full">
        <div className="game-header text-center mb-6">
          <h1 className="text-4xl font-bold drop-shadow mb-2">🍭 Candy Crush</h1>
          <p className="text-lg">Token: <span>{userId}</span></p>
        </div>

        <div className="game-stats flex justify-between text-lg font-semibold mb-4">
          <div className="stat-item bg-white/20 px-4 py-2 rounded-full">Score: {score}</div>
          <div className="stat-item bg-white/20 px-4 py-2 rounded-full">Time: {timeLeft}s</div>
          <div className="stat-item bg-white/20 px-4 py-2 rounded-full">Moves: {movesLeft}</div>
        </div>

        <div className="text-center mb-4">
          <button
            className="restart-btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-full hover:scale-105 transition-transform"
            onClick={toggleGame}
          >
            {gameActive ? (gamePaused ? 'Continue' : 'Pause') : 'Start Game'}
          </button>
        </div>

        <GameBoard />

        <Leaderboard />
        <GameOverModal score={score} onRestart={initGame} />
      </div>
    </div>
  );
};

export default App;
