import React from 'react';
import { Cell } from '../types/game';

interface CryptoCellProps {
  cell: Cell;
  isSelected: boolean;
  onClick: () => void;
  size: number;
}

export const CryptoCell: React.FC<CryptoCellProps> = ({ cell, isSelected, onClick, size }) => {
  const borderColor = isSelected ? 'border-yellow-400' : 'border-transparent';

  return (
    <div
      className={`flex items-center justify-center border-2 ${borderColor} rounded-md shadow-sm cursor-pointer`}
      style={{
        width: size,
        height: size,
        backgroundColor: cell.color,
        transition: 'all 0.2s',
      }}
      onClick={onClick}
    >
      <span className="text-white text-sm font-bold">{cell.symbol}</span>
    </div>
  );
};
