import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface RankEntry {
  username?: string;
  phone?: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [ranks, setRanks] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://h5game-backend-production.up.railway.app/api/rank')
      .then(res => res.json())
      .then((data: RankEntry[]) => {
        setRanks(data.slice(0, 10)); // Top 10 only
        setLoading(false);
      })
      .catch(() => {
        setRanks([]);
        setLoading(false);
      });
  }, []);

  const maskName = (username?: string, phone?: string) => {
    if (username) return username.slice(0, 4) + '***';
    if (phone) return phone.slice(0, 4) + '***';
    return 'Anonymous';
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Trophy className="w-4 h-4 text-purple-500" />;
    }
  };

  const getRankStyle = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200';
      case 2: return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200';
      case 3: return 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-200';
      default: return 'bg-white/50 border-purple-100';
    }
  };

  if (loading) {
    return (
      <div className="mt-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto"></div>
        <p className="text-white/70 mt-2">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Leaderboard
          <Trophy className="w-6 h-6 text-yellow-400" />
        </h3>
        <p className="text-white/70">Top 10 Players</p>
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        {ranks.length === 0 ? (
          <p className="text-center text-white/70 py-8">No scores yet. Be the first!</p>
        ) : (
          <div className="space-y-2">
            {ranks.map((player, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl border ${getRankStyle(index + 1)} transition-all duration-200 hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index + 1)}
                    <span className="font-bold text-gray-700">#{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {maskName(player.username, player.phone)}
                  </span>
                </div>
                <div className="font-bold text-purple-600">
                  {player.points.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;