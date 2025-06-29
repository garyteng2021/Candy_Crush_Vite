import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Cell, UserData } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';
import { findMatches, removeInitialMatches, areAdjacent, cellsEqual } from '../utils/gameUtils';
import { apiService } from '../services/api';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    score: 0,
    timeLeft: GAME_CONFIG.GAME_TIME,
    movesLeft: GAME_CONFIG.MAX_MOVES,
    gameActive: false,
    gamePaused: true,
    animating: false,
    selectedCell: null,
    dragStart: null
  });

  const [userData, setUserData] = useState<UserData>({ id: 'guest' });
  const [gameResponse, setGameResponse] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initializeGrid = useCallback(() => {
    const grid: (number | null)[][] = [];
    for (let row = 0; row < GAME_CONFIG.GRID_SIZE; row++) {
      grid[row] = [];
      for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
        grid[row][col] = Math.floor(Math.random() * GAME_CONFIG.COLORS.length);
      }
    }
    removeInitialMatches(grid, GAME_CONFIG.GRID_SIZE, GAME_CONFIG.COLORS);
    return grid;
  }, []);

  const initGame = useCallback(() => {
    const grid = initializeGrid();
    setGameState({
      grid,
      score: 0,
      timeLeft: GAME_CONFIG.GAME_TIME,
      movesLeft: GAME_CONFIG.MAX_MOVES,
      gameActive: false,
      gamePaused: true,
      animating: false,
      selectedCell: null,
      dragStart: null
    });
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [initializeGrid]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (!prev.gameActive || prev.gamePaused) return prev;
        
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) {
          return { ...prev, timeLeft: 0, gameActive: false };
        }
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);
  }, []);

  const endGame = useCallback(async () => {
    setGameState(prev => ({ ...prev, gameActive: false }));
    
    try {
      const response = await apiService.submitScore(userData.id, gameState.score);
      setGameResponse(response);
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  }, [userData.id, gameState.score]);

  const processCascade = useCallback(() => {
    setGameState(prev => ({ ...prev, animating: true }));
    
    const cascade = () => {
      setGameState(prev => {
        const matches = findMatches(prev.grid, GAME_CONFIG.GRID_SIZE);
        
        if (matches.length === 0) {
          const newState = { ...prev, animating: false };
          if (newState.movesLeft <= 0 || newState.timeLeft <= 0) {
            newState.gameActive = false;
          }
          return newState;
        }

        const newGrid = prev.grid.map(row => [...row]);
        let newScore = prev.score;

        // Remove matches
        matches.forEach(match => {
          newGrid[match.row][match.col] = null;
          newScore += GAME_CONFIG.POINTS_PER_BLOCK;
        });

        // Apply gravity
        for (let col = 0; col < GAME_CONFIG.GRID_SIZE; col++) {
          let writePos = GAME_CONFIG.GRID_SIZE - 1;
          
          for (let row = GAME_CONFIG.GRID_SIZE - 1; row >= 0; row--) {
            if (newGrid[row][col] !== null) {
              newGrid[writePos][col] = newGrid[row][col];
              if (writePos !== row) {
                newGrid[row][col] = null;
              }
              writePos--;
            }
          }
          
          // Fill empty spaces
          for (let row = 0; row <= writePos; row++) {
            newGrid[row][col] = Math.floor(Math.random() * GAME_CONFIG.COLORS.length);
          }
        }

        return { ...prev, grid: newGrid, score: newScore };
      });
      
      setTimeout(cascade, 300);
    };

    cascade();
  }, []);

  const attemptSwap = useCallback((cell1: Cell, cell2: Cell) => {
    if (!areAdjacent(cell1, cell2)) return;
    
    setGameState(prev => {
      const newGrid = prev.grid.map(row => [...row]);
      
      // Swap cells
      const temp = newGrid[cell1.row][cell1.col];
      newGrid[cell1.row][cell1.col] = newGrid[cell2.row][cell2.col];
      newGrid[cell2.row][cell2.col] = temp;
      
      // Check for matches
      const matches = findMatches(newGrid, GAME_CONFIG.GRID_SIZE);
      
      if (matches.length === 0) {
        // No matches, swap back
        const temp = newGrid[cell1.row][cell1.col];
        newGrid[cell1.row][cell1.col] = newGrid[cell2.row][cell2.col];
        newGrid[cell2.row][cell2.col] = temp;
        return prev;
      } else {
        // Valid move
        const newState = {
          ...prev,
          grid: newGrid,
          movesLeft: prev.movesLeft - 1,
          selectedCell: null,
          dragStart: null
        };
        
        // Process cascade after state update
        setTimeout(() => processCascade(), 100);
        
        return newState;
      }
    });
  }, [processCascade]);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameActive: true, gamePaused: false }));
    startTimer();
  }, [startTimer]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gamePaused: true }));
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gamePaused: false }));
    startTimer();
  }, [startTimer]);

  // Initialize Telegram user
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
      
      if (tgUser?.id) {
        setUserData({ id: tgUser.id.toString() });
      }
    }
  }, []);

  // Initialize game
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check for game end
  useEffect(() => {
    if (gameState.gameActive && (gameState.timeLeft <= 0 || gameState.movesLeft <= 0)) {
      endGame();
    }
  }, [gameState.gameActive, gameState.timeLeft, gameState.movesLeft, endGame]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    gameState,
    userData,
    gameResponse,
    initGame,
    startGame,
    pauseGame,
    resumeGame,
    attemptSwap,
    setGameState
  };
}