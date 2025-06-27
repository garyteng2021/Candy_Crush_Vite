// file: src/utils/gameLogic.ts
import { useState, useEffect, useRef } from 'react';
import { Cell as UICell } from '../types/game';

export const GRID_SIZE = 8;
export const COLORS = ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71'];
export const SYMBOLS = ['🍒', '🍋', '🍇', '🍉', '🍊'];
export const POINTS_PER_BLOCK = 10;
export const GAME_TIME = 60;
export const MAX_MOVES = 30;

export interface Cell {
  row: number;
  col: number;
}

export function useGameLogic() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(MAX_MOVES);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(true);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const timer = useRef<NodeJS.Timer>();

  const initGame = () => {
    const newGrid = createInitialGrid();
    setGrid(newGrid);
    setScore(0);
    setMovesLeft(MAX_MOVES);
    setTimeLeft(GAME_TIME);
    setGameActive(false);
    setGamePaused(true);
    clearInterval(timer.current);
    setSelectedCell(null);
  };

  const createInitialGrid = (): number[][] => {
    const newGrid: number[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        newGrid[row][col] = Math.floor(Math.random() * COLORS.length);
      }
    }
    return newGrid;
  };

  const startTimer = () => {
    timer.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer.current);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleGame = () => {
    if (!gameActive) {
      setGameActive(true);
      setGamePaused(false);
      startTimer();
    } else {
      if (gamePaused) {
        setGamePaused(false);
        startTimer();
      } else {
        setGamePaused(true);
        clearInterval(timer.current);
      }
    }
  };

  // === 新增：将 grid 映射为 UI 组件用的 board 格式 ===
  const board: UICell[][] = grid.map(row =>
    row.map(index => ({
      symbol: SYMBOLS[index],
      color: COLORS[index],
    }))
  );

  const handleCellClick = (row: number, col: number) => {
  if (!selectedCell) {
    setSelectedCell({ row, col });
  } else {
    const areAdjacent =
      (Math.abs(selectedCell.row - row) === 1 && selectedCell.col === col) ||
      (Math.abs(selectedCell.col - col) === 1 && selectedCell.row === row);

    if (areAdjacent) {
      const newGrid = grid.map(r => [...r]);
      const temp = newGrid[selectedCell.row][selectedCell.col];
      newGrid[selectedCell.row][selectedCell.col] = newGrid[row][col];
      newGrid[row][col] = temp;

      if (hasMatch(newGrid)) {
        setGrid(newGrid);
        setMovesLeft(prev => prev - 1);
        setScore(prev => prev + POINTS_PER_BLOCK);
      }
    }

    setSelectedCell(null);
  }
};
  
  useEffect(() => {
    initGame();
    return () => clearInterval(timer.current);
  }, []);

function hasMatch(grid: number[][]): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - 2; col++) {
      const val = grid[row][col];
      if (val === grid[row][col + 1] && val === grid[row][col + 2]) {
        return true;
      }
    }
  }

  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 0; row < GRID_SIZE - 2; row++) {
      const val = grid[row][col];
      if (val === grid[row + 1][col] && val === grid[row + 2][col]) {
        return true;
      }
    }
  }

  return false;
}

  
  return {
    grid,
    score,
    timeLeft,
    movesLeft,
    gameActive,
    gamePaused,
    selectedCell,
    initGame,
    toggleGame,
    setSelectedCell,
    setGrid,
    setScore,
    setMovesLeft,
    setGameActive,
    board,
    handleCellClick,
  };
}
