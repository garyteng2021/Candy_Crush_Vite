import React from 'react';

type Props = {
  score: number;
  onRestart: () => void;
};

const GameOverModal: React.FC<Props> = ({ score, onRestart }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white text-gray-800 p-10 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-2xl font-bold text-indigo-600">🎉 Game Over</h2>
        <p className="text-4xl font-bold text-purple-600 my-4">{score}</p>
        <button
          onClick={onRestart}
          className="mt-4 px-6 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
