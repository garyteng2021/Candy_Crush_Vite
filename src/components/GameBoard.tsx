import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 8;
const CELL_SIZE = 60;
const COLORS = ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71'];

const GameBoard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<number[][]>([]);

  const initGrid = () => {
    const newGrid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => Math.floor(Math.random() * COLORS.length))
    );
    setGrid(newGrid);
  };

  useEffect(() => {
    initGrid();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || grid.length === 0) return;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;
        ctx.fillStyle = COLORS[grid[row][col]];
        ctx.beginPath();
        ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [grid]);

  return (
    <canvas
      ref={canvasRef}
      width={GRID_SIZE * CELL_SIZE}
      height={GRID_SIZE * CELL_SIZE}
      className="rounded-lg border border-white/20 bg-white/5 cursor-pointer"
    />
  );
};

export default GameBoard;
