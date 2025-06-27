import React from 'react';
import { Cell } from '../types/game';

interface CryptoCellProps {
  cell: Cell;
  isSelected: boolean;
  onClick: () => void;
  size: number;
  row: number;
  col: number;
}

export const CryptoCell: React.FC<CryptoCellProps> = ({ 
  cell, 
  isSelected, 
  onClick, 
  size, 
  row, 
  col 
}) => {
  return (
    <div
      className={`candy-cell ${isSelected ? 'selected' : ''}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${cell.color}, ${adjustBrightness(cell.color, -20)})`,
        animationDelay: `${(row + col) * 50}ms`
      }}
      onClick={onClick}
    >
      <span className="text-white drop-shadow-lg text-xl font-bold select-none">
        {cell.symbol}
      </span>
      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
};

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}