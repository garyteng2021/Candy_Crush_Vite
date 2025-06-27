import React from 'react';

interface GameOverModalProps {
  finalScore: number;
  onRestart: () => void;
  visible: boolean;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ finalScore, onRestart, visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="bg-white text-gray-800 p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">
        <h2 className="text-2xl text-indigo-500 font-bold mb-4">🎉 Game Over!</h2>
        <div className="text-4xl font-bold text-purple-600 my-4">{finalScore}</div>
        <p className="mb-6">Great job! Your score has been submitted.</p>
        <button
          className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white rounded-full px-6 py-3 text-lg hover:scale-105 transition-transform"
          onClick={onRestart}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
