import React from 'react';
import GameBoard from './components/GameBoard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">🍭 Candy Crush</h1>
        <GameBoard />
      </div>
    </div>
  );
};

export default App;
