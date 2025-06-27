import React from 'react';
import { Cell } from '../types/game';
import { CryptoCell } from './CryptoCell';
import { GAME_CONFIG } from '../config/gameConfig';

interface GameBoardProps {
  board: Cell[][];
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  selectedCell, 
  onCellClick, 
  disabled 
}) => {
  const cellSize = Math.min(
    Math.floor((window.innerWidth - 100) / GAME_CONFIG.BOARD_SIZE),
    Math.floor((window.innerHeight - 400) / GAME_CONFIG.BOARD_SIZE),
    60
  );

  return (
    <div className="flex justify-center mb-8">
      <div 
        className="game-board grid gap-2 p-4 bg-white/5 rounded-3xl border border-white/20 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${GAME_CONFIG.BOARD_SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${GAME_CONFIG.BOARD_SIZE}, ${cellSize}px)`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <CryptoCell
              key={`${rowIndex}-${colIndex}-${cell.id}`}
              cell={cell}
              isSelected={
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              }
              onClick={() => !disabled && onCellClick(rowIndex, colIndex)}
              size={cellSize}
              row={rowIndex}
              col={colIndex}
            />
          ))
        )}
      </div>
    </div>
  );
};