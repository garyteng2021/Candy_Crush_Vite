// src/components/GameContainer.tsx
import React from 'react';

const GameContainer: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-400 to-purple-600 text-white font-sans">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 w-[520px] max-w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold drop-shadow mb-2">🍭 Candy Crush</h1>
          <p className="text-white/90 text-sm">Token: <span id="token">?</span></p>
          <p className="text-white/90 text-sm">积分: <span id="points">?</span></p>
        </div>

        <div className="flex justify-between font-bold text-lg mb-6 gap-2">
          <div className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm">Score: <span id="score">0</span></div>
          <div className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm">Time: <span id="timer">60</span>s</div>
          <div className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm">Moves: <span id="moves">30</span></div>
        </div>

        <div className="text-center mb-6">
          <button id="controlButton" className="restart-btn bg-gradient-to-br from-indigo-400 to-purple-600 text-white rounded-full px-6 py-3 text-lg hover:scale-105 transition-transform">Start Game</button>
        </div>

        <canvas id="gameCanvas" width="480" height="480" className="border-4 border-white/30 rounded-xl bg-white/10 mx-auto block cursor-grab active:cursor-grabbing"></canvas>

        {/* Game Over Modal */}
        <div id="gameOverModal" className="fixed top-0 left-0 w-full h-full bg-black/80 hidden justify-center items-center z-50">
          <div className="bg-white text-gray-800 p-10 rounded-2xl shadow-2xl text-center max-w-sm w-full">
            <h2 className="text-2xl text-indigo-500 font-bold mb-4">🎉 Game Over!</h2>
            <div className="text-4xl font-bold text-purple-600 my-4" id="finalScore">0</div>
            <p className="mb-6">Great job! Your score has been submitted.</p>
            <button className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white rounded-full px-6 py-3 text-lg hover:scale-105 transition-transform" onClick={() => window.location.reload()}>Play Again</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameContainer;
