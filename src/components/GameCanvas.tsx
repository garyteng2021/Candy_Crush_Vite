import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, Cell } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';
import { getCellFromPosition, cellsEqual, lightenColor } from '../utils/gameUtils';

interface GameCanvasProps {
  gameState: GameState;
  onCellInteraction: (from: Cell, to: Cell) => void;
  onCellSelect: (cell: Cell | null) => void;
  onDragStart: (cell: Cell | null) => void;
}

export function GameCanvas({ gameState, onCellInteraction, onCellSelect, onDragStart }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartRef = useRef<Cell | null>(null);

  const drawCandy = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const radius = size / 2 - 2;

    // Create gradient
    const gradient = ctx.createRadialGradient(
      centerX - radius / 3, centerY - radius / 3, 0,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, lightenColor(color, 40));
    gradient.addColorStop(1, color);

    // Draw candy
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Add shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 3, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
      for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
        const x = col * GAME_CONFIG.CELL_SIZE;
        const y = row * GAME_CONFIG.CELL_SIZE;
        
        // Draw cell background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x, y, GAME_CONFIG.CELL_SIZE, GAME_CONFIG.CELL_SIZE);
        
        // Draw cell border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, GAME_CONFIG.CELL_SIZE, GAME_CONFIG.CELL_SIZE);
        
        // Draw candy
        if (gameState.grid[row] && gameState.grid[row][col] !== null) {
          drawCandy(ctx, x + 5, y + 5, GAME_CONFIG.CELL_SIZE - 10, GAME_CONFIG.COLORS[gameState.grid[row][col]!]);
        }
        
        // Highlight selected cell
        if (gameState.selectedCell && gameState.selectedCell.row === row && gameState.selectedCell.col === col) {
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, GAME_CONFIG.CELL_SIZE, GAME_CONFIG.CELL_SIZE);
        }
      }
    }
  }, [gameState.grid, gameState.selectedCell, drawCandy]);

  const getCanvasPosition = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  const handleStart = useCallback((e: MouseEvent | TouchEvent) => {
    if (!gameState.gameActive || gameState.gamePaused || gameState.animating) return;
    
    const pos = getCanvasPosition(e);
    if (!pos) return;

    const cell = getCellFromPosition(pos.x, pos.y, GAME_CONFIG.CELL_SIZE, GAME_CONFIG.GRID_SIZE);
    if (cell) {
      dragStartRef.current = cell;
      onCellSelect(cell);
      onDragStart(cell);
    }
  }, [gameState.gameActive, gameState.gamePaused, gameState.animating, getCanvasPosition, onCellSelect, onDragStart]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!gameState.gameActive || gameState.gamePaused || gameState.animating || !dragStartRef.current) return;
    
    const pos = getCanvasPosition(e);
    if (!pos) return;

    const cell = getCellFromPosition(pos.x, pos.y, GAME_CONFIG.CELL_SIZE, GAME_CONFIG.GRID_SIZE);
    if (cell && !cellsEqual(cell, dragStartRef.current)) {
      onCellSelect(cell);
    }
  }, [gameState.gameActive, gameState.gamePaused, gameState.animating, getCanvasPosition, onCellSelect]);

  const handleEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!gameState.gameActive || gameState.gamePaused || gameState.animating || !dragStartRef.current || !gameState.selectedCell) return;
    
    if (!cellsEqual(dragStartRef.current, gameState.selectedCell)) {
      onCellInteraction(dragStartRef.current, gameState.selectedCell);
    }
    
    dragStartRef.current = null;
    onCellSelect(null);
    onDragStart(null);
  }, [gameState.gameActive, gameState.gamePaused, gameState.animating, gameState.selectedCell, onCellInteraction, onCellSelect, onDragStart]);

  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => handleStart(e);
    const handleMouseMove = (e: MouseEvent) => handleMove(e);
    const handleMouseUp = (e: MouseEvent) => handleEnd(e);
    
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handleStart(e);
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handleEnd(e);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  // Render when state changes
  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.GRID_SIZE * GAME_CONFIG.CELL_SIZE}
        height={GAME_CONFIG.GRID_SIZE * GAME_CONFIG.CELL_SIZE}
        className="border-2 border-white/30 rounded-xl bg-white/10 backdrop-blur-sm cursor-grab active:cursor-grabbing max-w-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}