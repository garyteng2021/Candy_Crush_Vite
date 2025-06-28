// === src/components/GameBoard.tsx ===
import React, { useEffect, useRef, useState } from 'react';
import {
  CELL_SIZE,
  GRID_SIZE
} from '../config/gameConfig';
import {
  generateGrid,
  drawBoard,
  getCellFromCoords,
  attemptSwapAndMatch
} from '../utils/gameLogic';

interface Props {
  score: number;
  setScore: (val: number) => void;
  movesLeft: number;
  setMovesLeft: (val: number) => void;
  paused: boolean;
  setGameOver: (val: boolean) => void;
}

const GameBoard: React.FC<Props> = ({
  score,
  setScore,
  movesLeft,
  setMovesLeft,
  paused,
  setGameOver
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<number[][]>(generateGrid());
  const [dragStart, setDragStart] = useState<{ row: number; col: number } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Draw the board on every update
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;
    drawBoard(ctx, grid, selectedCell);
  }, [grid, selectedCell]);

  // Get cell from canvas coordinate
  const getPosition = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return getCellFromCoords(x, y);
  };

  // Start of drag or touch
  const handleStart = (e: MouseEvent | TouchEvent) => {
    if (paused) return;
    const cell = getPosition(e);
    if (cell) {
      setDragStart(cell);
      setSelectedCell(cell);
    }
  };

  // Move over new cell
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (paused || !dragStart) return;
    const cell = getPosition(e);
    if (cell && (cell.row !== dragStart.row || cell.col !== dragStart.col)) {
      setSelectedCell(cell);
    }
  };

  // Release or end of drag/touch
  const handleEnd = (e: MouseEvent | TouchEvent) => {
    if (paused || !dragStart || !selectedCell) return;
    const target = selectedCell;
    const result = attemptSwapAndMatch([...grid], dragStart, target);

    if (result.updated) {
      setGrid(result.updated);
      setScore(score + result.score);
      setMovesLeft(movesLeft - 1);
    }

    setDragStart(null);
    setSelectedCell(null);
  };

  // Register all input events
  useEffect(() => {
    const canvas = canvasRef.current!;
    const down = (e: any) => handleStart(e);
    const move = (e: any) => handleMove(e);
    const up = (e: any) => handleEnd(e);

    canvas.addEventListener('mousedown', down);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', down, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', up, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', down);
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseup', up);
      canvas.removeEventListener('touchstart', down);
      canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', up);
    };
  });

  return (
    <canvas
      id="gameCanvas"
      ref={canvasRef}
      className="mt-4"
    />
  );
};

export default GameBoard;
