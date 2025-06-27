import { useState, useEffect, useRef, useCallback } from 'react';
import { Cell as UICell, Position } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';
import { submitScore } from './api';

export function useGameLogic() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(GAME_CONFIG.MAX_MOVES);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.GAME_TIME);
  const [gameActive, setGameActive] = useState(false);
  const [gamePaused, setGamePaused] = useState(true);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const timer = useRef<NodeJS.Timer>();

  const createInitialGrid = useCallback((): number[][] => {
    const newGrid: number[][] = [];
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
        let cellValue;
        do {
          cellValue = Math.floor(Math.random() * GAME_CONFIG.COLORS.length);
        } while (
          (col >= 2 && newGrid[row][col - 1] === cellValue && newGrid[row][col - 2] === cellValue) ||
          (row >= 2 && newGrid[row - 1] && newGrid[row - 1][col] === cellValue && 
           newGrid[row - 2] && newGrid[row - 2][col] === cellValue)
        );
        newGrid[row][col] = cellValue;
      }
    }
    return newGrid;
  }, []);

  const initGame = useCallback(() => {
    const newGrid = createInitialGrid();
    setGrid(newGrid);
    setScore(0);
    setMovesLeft(GAME_CONFIG.MAX_MOVES);
    setTimeLeft(GAME_CONFIG.GAME_TIME);
    setGameActive(false);
    setGamePaused(true);
    setGameOver(false);
    setLevel(1);
    clearInterval(timer.current);
    setSelectedCell(null);
  }, [createInitialGrid]);

  const startTimer = useCallback(() => {
    timer.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer.current);
          setGameActive(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const toggleGame = useCallback(() => {
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
  }, [gameActive, gamePaused, startTimer]);

  const findMatches = useCallback((grid: number[][]): Position[] => {
    const matches: Position[] = [];
    
    // Check horizontal matches
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
      for (let col = 0; col < GAME_CONFIG.BOARD_SIZE - 2; col++) {
        const value = grid[row][col];
        if (value === grid[row][col + 1] && value === grid[row][col + 2]) {
          matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
      for (let row = 0; row < GAME_CONFIG.BOARD_SIZE - 2; row++) {
        const value = grid[row][col];
        if (value === grid[row + 1][col] && value === grid[row + 2][col]) {
          matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
        }
      }
    }

    return matches.filter((match, index, self) => 
      index === self.findIndex(m => m.row === match.row && m.col === match.col)
    );
  }, []);

  const removeMatches = useCallback((grid: number[][], matches: Position[]): number[][] => {
    const newGrid = grid.map(row => [...row]);
    matches.forEach(({ row, col }) => {
      newGrid[row][col] = -1; // Mark for removal
    });
    return newGrid;
  }, []);

  const dropCandies = useCallback((grid: number[][]): number[][] => {
    const newGrid = grid.map(row => [...row]);
    
    for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
      let writeIndex = GAME_CONFIG.BOARD_SIZE - 1;
      
      for (let row = GAME_CONFIG.BOARD_SIZE - 1; row >= 0; row--) {
        if (newGrid[row][col] !== -1) {
          newGrid[writeIndex][col] = newGrid[row][col];
          if (writeIndex !== row) {
            newGrid[row][col] = -1;
          }
          writeIndex--;
        }
      }
      
      // Fill empty spaces with new candies
      for (let row = 0; row <= writeIndex; row++) {
        newGrid[row][col] = Math.floor(Math.random() * GAME_CONFIG.COLORS.length);
      }
    }
    
    return newGrid;
  }, []);

  const processMatches = useCallback((grid: number[][]): { newGrid: number[][], matchCount: number } => {
    let currentGrid = grid;
    let totalMatches = 0;
    
    while (true) {
      const matches = findMatches(currentGrid);
      if (matches.length === 0) break;
      
      totalMatches += matches.length;
      currentGrid = removeMatches(currentGrid, matches);
      currentGrid = dropCandies(currentGrid);
    }
    
    return { newGrid: currentGrid, matchCount: totalMatches };
  }, [findMatches, removeMatches, dropCandies]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameActive || gamePaused || gameOver) return;

    if (!selectedCell) {
      setSelectedCell({ row, col });
    } else {
      const areAdjacent =
        (Math.abs(selectedCell.row - row) === 1 && selectedCell.col === col) ||
        (Math.abs(selectedCell.col - col) === 1 && selectedCell.row === row);

      if (areAdjacent && !(selectedCell.row === row && selectedCell.col === col)) {
        const newGrid = grid.map(r => [...r]);
        const temp = newGrid[selectedCell.row][selectedCell.col];
        newGrid[selectedCell.row][selectedCell.col] = newGrid[row][col];
        newGrid[row][col] = temp;

        const { newGrid: processedGrid, matchCount } = processMatches(newGrid);
        
        if (matchCount > 0) {
          setGrid(processedGrid);
          setMovesLeft(prev => {
            const newMoves = prev - 1;
            if (newMoves <= 0) {
              setGameActive(false);
              setGameOver(true);
              clearInterval(timer.current);
            }
            return newMoves;
          });
          
          const points = matchCount * GAME_CONFIG.POINTS_PER_MATCH;
          const bonusPoints = matchCount > 3 ? Math.floor(points * GAME_CONFIG.BONUS_MULTIPLIER) : points;
          setScore(prev => prev + bonusPoints);
          
          // Level progression
          setLevel(prev => Math.floor(score / 1000) + 1);
        } else {
          // Revert the swap if no matches
          const revertedGrid = grid.map(r => [...r]);
          setGrid(revertedGrid);
        }
      }

      setSelectedCell(null);
    }
  }, [gameActive, gamePaused, gameOver, selectedCell, grid, processMatches, score]);

  // Convert grid to UI board format
  const board: UICell[][] = grid.map((row, rowIndex) =>
    row.map((colorIndex, colIndex) => ({
      symbol: GAME_CONFIG.SYMBOLS[colorIndex] || '🍭',
      color: GAME_CONFIG.COLORS[colorIndex] || '#FF6B6B',
      id: `${rowIndex}-${colIndex}-${colorIndex}-${Date.now()}`
    }))
  );

  // Submit score when game ends
  useEffect(() => {
    if (gameOver && score > 0) {
      const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || 'anonymous';
      submitScore(userId, score).catch(console.error);
    }
  }, [gameOver, score]);

  useEffect(() => {
    initGame();
    return () => clearInterval(timer.current);
  }, [initGame]);

  return {
    gameActive,
    gamePaused,
    gameOver,
    timeLeft,
    score,
    movesLeft,
    level,
    toggleGame,
    initGame,
    board,
    selectedCell,
    handleCellClick
  };
}