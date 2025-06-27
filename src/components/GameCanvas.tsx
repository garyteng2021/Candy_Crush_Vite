import React, { useEffect, useRef } from 'react';

interface GameCanvasProps {
  grid: number[][];
  selectedCell: { row: number; col: number } | null;
  onCellSelect?: (cell: { row: number; col: number }) => void;
  colors?: string[];
}

const CELL_SIZE = 60;

const defaultColors = [
  '#e74c3c', // Red
  '#f1c40f', // Yellow
  '#3498db', // Blue
  '#9b59b6', // Purple
  '#2ecc71'  // Green
];

const GameCanvas: React.FC<GameCanvasProps> = ({
  grid,
  selectedCell,
  onCellSelect,
  colors = defaultColors
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;

        // Background cell
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

        // Candy
        const colorIndex = grid[row][col];
        if (colorIndex !== null && colors[colorIndex]) {
          drawCandy(ctx, x + 5, y + 5, CELL_SIZE - 10, colors[colorIndex]);
        }

        // Selection highlight
        if (selectedCell?.row === row && selectedCell?.col === col) {
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  }, [grid, selectedCell, colors]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onCellSelect) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < grid.length && col >= 0 && col < grid[row].length) {
      onCellSelect({ row, col });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={CELL_SIZE * grid[0].length}
      height={CELL_SIZE * grid.length}
      className="border-4 border-white/30 rounded-xl bg-white/10 mx-auto block cursor-pointer"
      onClick={handleClick}
    />
  );
};

function drawCandy(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size / 2 - 2;

  const gradient = ctx.createRadialGradient(
    centerX - radius / 3,
    centerY - radius / 3,
    0,
    centerX,
    centerY,
    radius
  );
  gradient.addColorStop(0, lightenColor(color, 40));
  gradient.addColorStop(1, color);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 3, 0, Math.PI * 2);
  ctx.fill();
}

function lightenColor(color: string, percent: number) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

export default GameCanvas;
