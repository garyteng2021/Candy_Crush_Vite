import React from 'react';
import GameStats from './GameStats';

interface GameHeaderProps {
  score: number;
  timeLeft: number;
  movesLeft: number;
  paused: boolean;
  onTogglePause: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  timeLeft,
  movesLeft,
  paused,
  onTogglePause,
}) => {
  return (
    <div className="game-header">
      <h1 className="game-title">消消乐游戏</h1>
      <GameStats score={score} timeLeft={timeLeft} movesLeft={movesLeft} />
      <button className="restart-btn" onClick={onTogglePause}>
        {paused ? '开始游戏' : '暂停'}
      </button>
    </div>
  );
};

export default GameHeader;
