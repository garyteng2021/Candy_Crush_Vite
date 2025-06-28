import React, { useEffect, useState } from 'react';
import { loadRanking } from '..utilsapi';
import { ScoreEntry } from '..typesgame';

const Leaderboard React.FC = () = {
  const [entries, setEntries] = useStateScoreEntry[]([]);

  useEffect(() = {
    loadRanking().then(setEntries).catch(console.error);
  }, []);

  const maskName = (name string, phone string) = {
    if (name) return name.slice(0, 4) + '';
    if (phone) return phone.slice(0, 4) + '';
    return '匿名';
  };

  return (
    div className=mt-8 text-center
      h3 className=text-lg font-bold text-white mb-2🏆 排行榜 Top 10h3
      table className=mx-auto bg-white text-gray-800 border border-gray-300 rounded text-sm
        thead className=bg-gray-200 text-gray-900
          tr
            th className=px-3 py-1名次th
            th className=px-3 py-1用户th
            th className=px-3 py-1积分th
          tr
        thead
        tbody
          {entries.map((e, i) = (
            tr key={i} className=border-t
              td className=px-3 py-1{i + 1}td
              td className=px-3 py-1{maskName(e.username, e.phone)}td
              td className=px-3 py-1{e.points}td
            tr
          ))}
        tbody
      table
    div
  );
};

export default Leaderboard;