import React from 'react';
import { Candy } from 'lucide-react';
import { UserData } from '../types/game';

interface GameHeaderProps {
  userData: UserData;
  points?: number;
  token?: string;
}

export function GameHeader({ userData, points, token }: GameHeaderProps) {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Candy className="text-4xl text-pink-400" size={48} />
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          Candy Crush
        </h1>
      </div>
      
      <div className="flex justify-center gap-6 text-sm text-white/90">
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="font-medium">Token: </span>
          <span className="text-yellow-300">{token || '?'}</span>
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="font-medium">积分: </span>
          <span className="text-green-300">{points || '?'}</span>
        </div>
      </div>
    </div>
  );
}