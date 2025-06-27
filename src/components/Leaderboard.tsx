import React, { useEffect, useState } from 'react';

interface RankEntry {
  username?: string;
  phone?: string;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [ranks, setRanks] = useState<RankEntry[]>([]);

  useEffect(() => {
    fetch('https://h5game-backend-production.up.railway.app/api/rank')
      .then(res => res.json())
      .then((data: RankEntry[]) => setRanks(data))
      .catch(() => setRanks([]));
  }, []);

  const maskName = (username?: string, phone?: string) => {
    if (username) return username.slice(0, 4) + '***';
    if (phone) return phone.slice(0, 4) + '***';
    return '匿名';
  };

  return (
    <div className="mt-8 text-center">
      <h5 className="text-xl font-semibold mb-2">🏆 总积分排行榜 (Top 10)</h5>
      <table className="mx-auto bg-white text-gray-800 border border-gray-300 rounded overflow-hidden text-sm">
        <thead>
          <tr className="bg-gray-200 text-gray-900">
            <th className="px-4 py-2 border">名次</th>
            <th className="px-4 py-2 border">用户名</th>
            <th className="px-4 py-2 border">积分</th>
          </tr>
        </thead>
        <tbody>
          {ranks.map((row, i) => (
            <tr key={i}>
              <td className="border px-4 py-1">{i + 1}</td>
              <td className="border px-4 py-1">{maskName(row.username, row.phone)}</td>
              <td className="border px-4 py-1">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
