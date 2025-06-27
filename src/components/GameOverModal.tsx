import React from 'react';
import { Trophy, RotateCcw, Star } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
  visible: boolean;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart, visible }) => {
  if (!visible) return null;

  const getPerformanceMessage = (score: number) => {
    if (score >= 2000) return { message: "Incredible! You're a Candy Master! 🏆", color: "text-yellow-500" };
    if (score >= 1500) return { message: "Amazing! Sweet Victory! 🌟", color: "text-purple-500" };
    if (score >= 1000) return { message: "Great Job! Keep it up! 🎉", color: "text-blue-500" };
    if (score >= 500) return { message: "Good Work! Getting better! 👍", color: "text-green-500" };
    return { message: "Nice Try! Practice makes perfect! 💪", color: "text-pink-500" };
  };

  const performance = getPerformanceMessage(score);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl text-center max-w-md w-full p-8 transform animate-in zoom-in duration-300">
        <div className="sparkle mb-6">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
        <p className={`text-lg font-semibold mb-4 ${performance.color}`}>
          {performance.message}
        </p>
        
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <span className="text-gray-600 font-medium">Final Score</span>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-4xl font-bold text-purple-600">{score.toLocaleString()}</div>
        </div>
        
        <button
          className="game-button w-full flex items-center justify-center gap-2"
          onClick={onRestart}
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;