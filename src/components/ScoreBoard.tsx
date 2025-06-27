import React from 'react';

interface ScoreBoardProps {
  score: number;
  timeLeft: number;
  movesLeft: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, timeLeft, movesLeft }) => {
  return (
    <div className="flex justify-between font-bold text-lg mb-6 gap-2">
      <div className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm">
        Score: <span>{score}</span>
      </div>
      <div className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm">
        Time: <span>{timeLeft}</span>s
      </div>
      <div className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm">
        Moves: <span>{movesLeft}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;
