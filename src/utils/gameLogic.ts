import { useState, useEffect, useRef } from 'react';

export const GRID_SIZE = 8;
export const COLORS = ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71'];
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
  };

  const createInitialGrid = () => {
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

  useEffect(() => {
    initGame();
    return () => clearInterval(timer.current);
  }, []);

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
    setGameActive
  };
}
