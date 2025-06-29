import { GameConfig } from '../types/game';

export const GAME_CONFIG: GameConfig = {
  GRID_SIZE: 8,
  CELL_SIZE: 60,
  COLORS: [
    '#e74c3c', // Red
    '#f1c40f', // Yellow
    '#3498db', // Blue
    '#9b59b6', // Purple
    '#2ecc71'  // Green
  ],
  POINTS_PER_BLOCK: 10,
  GAME_TIME: 60,
  MAX_MOVES: 30
};

export const API_BASE_URL = 'https://h5game-backend-production.up.railway.app';