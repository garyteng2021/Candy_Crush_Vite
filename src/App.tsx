import React from 'react';
import GameContainer from './components/GameContainer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 text-white">
      <GameContainer />
    </div>
  );
};

export default App;
