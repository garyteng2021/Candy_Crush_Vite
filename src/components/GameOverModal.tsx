import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  onRestart: () => void;
}

export function GameOverModal({ isOpen, score, onRestart }: GameOverModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
            <Trophy className="text-white" size={48} />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 Game Over!</h2>
        
        <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          {score}
        </div>
        
        <p className="text-gray-600 mb-8 text-lg">
          Great job! Your score has been submitted.
        </p>
        
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 flex items-center gap-3 mx-auto"
        >
          <RotateCcw size={20} />
          Play Again
        </button>
      </div>
    </div>
  );
}