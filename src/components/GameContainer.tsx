// src/components/GameContainer.tsx
import React from 'react';

const GameContainer: React.FC = () => {
  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 w-full max-w-xl mx-auto text-white font-sans">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold drop-shadow mb-2">🍭 Candy Crush</h1>
        <p className="text-sm">Token: <span id="token">?</span></p>
        <p className="text-sm">积分: <span id="points">?</span></p>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-lg font-bold mb-6 gap-2">
        <div className="bg-white/20 px-5 py-2 rounded-full backdrop-blur-sm">Score: <span id="score">0</span></div>
        <div className="bg-white/20 px-5 py-2 rounded-full backdrop-blur-sm">Time: <span id="timer">60</span>s</div>
        <div className="bg-white/20 px-5 py-2 rounded-full backdrop-blur-sm">Moves: <span id="moves">30</span></div>
      </div>

      {/* Start Button */}
      <div className="text-center mb-6">
        <button id="controlButton" className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white rounded-full px-6 py-3 text-lg hover:scale-105 transition-transform">
          Start Game
        </button>
      </div>

      {/* Canvas */}
      <canvas
        id="gameCanvas"
        width="480"
        height="480"
        className="border-4 border-white/30 rounded-xl bg-white/10 mx-auto block cursor-grab active:cursor-grabbing"
      />

      {/* Leaderboard */}
      <div id="rankBlock" className="mt-8 text-center">
        <h5 className="text-xl font-semibold mb-2">🏆 总积分排行榜 (Top 10)</h5>
        <table className="mx-auto bg-white text-gray-800 border border-gray-300 rounded overflow-hidden text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-900">
              <th className="px-4 py-2 border">名次</th>
              <th className="px-4 py-2 border">用户名</th>
              <th className="px-4 py-2 border">积分</th>
            </tr>
          </thead>
          <tbody id="rankBody" />
        </table>
      </div>

      {/* Game Over Modal */}
      <div
        id="gameOverModal"
        className="hidden fixed top-0 left-0 w-full h-full bg-black/80 flex justify-center items-center z-50"
      >
        <div className="bg-white text-gray-800 p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">
          <h2 className="text-2xl text-indigo-500 font-bold mb-4">🎉 Game Over!</h2>
          <div className="text-4xl font-bold text-purple-600 my-4" id="finalScore">0</div>
          <p className="mb-6">Great job! Your score has been submitted.</p>
          <button
            className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white rounded-full px-6 py-3 text-lg hover:scale-105 transition-transform"
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameContainer;
