import React from 'react';

interface GameStatsProps {
  score: number;
  timeLeft: number;
  movesLeft: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, timeLeft, movesLeft }) => {
  return (
    <div className="game-stats">
      <div className="stat-item">分数: {score}</div>
      <div className="stat-item">时间: {timeLeft}</div>
      <div className="stat-item">步数: {movesLeft}</div>
    </div>
  );
};

export default GameStats;