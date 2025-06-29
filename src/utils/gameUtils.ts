import { Cell, Match, GameConfig } from '../types/game';

export function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

export function cellsEqual(cell1: Cell, cell2: Cell): boolean {
  return cell1.row === cell2.row && cell1.col === cell2.col;
}

export function areAdjacent(cell1: Cell, cell2: Cell): boolean {
  const rowDiff = Math.abs(cell1.row - cell2.row);
  const colDiff = Math.abs(cell1.col - cell2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function getCellFromPosition(x: number, y: number, cellSize: number, gridSize: number): Cell | null {
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  
  if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
    return { row, col };
  }
  return null;
}

export function maskName(username?: string, phone?: string): string {
  if (username) return username.slice(0, 4) + '***';
  if (phone) return phone.slice(0, 4) + '***';
  return '匿名';
}

export function findMatches(grid: (number | null)[][], gridSize: number): Match[] {
  const matches: Match[] = [];

  // Check horizontal matches
  for (let row = 0; row < gridSize; row++) {
    let count = 1;
    let currentColor = grid[row][0];
    
    for (let col = 1; col < gridSize; col++) {
      if (grid[row][col] === currentColor && currentColor !== null) {
        count++;
      } else {
        if (count >= 3) {
          for (let i = col - count; i < col; i++) {
            matches.push({ row, col: i });
          }
        }
        count = 1;
        currentColor = grid[row][col];
      }
    }
    
    if (count >= 3) {
      for (let i = gridSize - count; i < gridSize; i++) {
        matches.push({ row, col: i });
      }
    }
  }

  // Check vertical matches
  for (let col = 0; col < gridSize; col++) {
    let count = 1;
    let currentColor = grid[0][col];
    
    for (let row = 1; row < gridSize; row++) {
      if (grid[row][col] === currentColor && currentColor !== null) {
        count++;
      } else {
        if (count >= 3) {
          for (let i = row - count; i < row; i++) {
            matches.push({ row: i, col });
          }
        }
        count = 1;
        currentColor = grid[row][col];
      }
    }
    
    if (count >= 3) {
      for (let i = gridSize - count; i < gridSize; i++) {
        matches.push({ row: i, col });
      }
    }
  }

  return matches;
}

export function removeInitialMatches(grid: (number | null)[][], gridSize: number, colors: string[]): void {
  let hasMatches = true;
  while (hasMatches) {
    hasMatches = false;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Check horizontal matches
        if (col <= gridSize - 3) {
          if (grid[row][col] === grid[row][col + 1] && 
              grid[row][col] === grid[row][col + 2]) {
            grid[row][col] = Math.floor(Math.random() * colors.length);
            hasMatches = true;
          }
        }
        // Check vertical matches
        if (row <= gridSize - 3) {
          if (grid[row][col] === grid[row + 1][col] && 
              grid[row][col] === grid[row + 2][col]) {
            grid[row][col] = Math.floor(Math.random() * colors.length);
            hasMatches = true;
          }
        }
      }
    }
  }
}