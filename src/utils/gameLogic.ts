// === src/utils/gameLogic.ts ===
import {
  CELL_SIZE,
  COLORS,
  GRID_SIZE,
  POINTS_PER_BLOCK
} from '../config/gameConfig';

export function generateGrid(): number[][] {
  const grid: number[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    const r: number[] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      r.push(Math.floor(Math.random() * COLORS.length));
    }
    grid.push(r);
  }
  return grid;
}

export function drawBoard(
  ctx: CanvasRenderingContext2D,
  grid: number[][],
  selected: { row: number; col: number } | null
) {
  ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const x = col * CELL_SIZE;
      const y = row * CELL_SIZE;
      const color = COLORS[grid[row][col]];
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        x + CELL_SIZE / 2,
        y + CELL_SIZE / 2,
        CELL_SIZE / 2.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      if (selected && selected.row === row && selected.col === col) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
      }
    }
  }
}

export function getCellFromCoords(x: number, y: number) {
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);
  if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
    return { row, col };
  }
  return null;
}

export function attemptSwapAndMatch(
  grid: number[][],
  from: { row: number; col: number },
  to: { row: number; col: number }
): { updated?: number[][]; score: number } {
  const isAdjacent =
    (Math.abs(from.row - to.row) === 1 && from.col === to.col) ||
    (Math.abs(from.col - to.col) === 1 && from.row === to.row);

  if (!isAdjacent) return { score: 0 };

  const temp = grid[from.row][from.col];
  grid[from.row][from.col] = grid[to.row][to.col];
  grid[to.row][to.col] = temp;

  const matches = findMatches(grid);
  if (matches.length === 0) {
    // Swap back if no match
    grid[to.row][to.col] = grid[from.row][from.col];
    grid[from.row][from.col] = temp;
    return { score: 0 };
  }

  for (const { row, col } of matches) {
    grid[row][col] = Math.floor(Math.random() * COLORS.length);
  }

  return {
    updated: grid,
    score: matches.length * POINTS_PER_BLOCK
  };
}

export function findMatches(grid: number[][]): { row: number; col: number }[] {
  const matches: { row: number; col: number }[] = [];

  // horizontal
  for (let row = 0; row < GRID_SIZE; row++) {
    let count = 1;
    for (let col = 1; col < GRID_SIZE; col++) {
      if (grid[row][col] === grid[row][col - 1]) {
        count++;
      } else {
        if (count >= 3) {
          for (let k = 0; k < count; k++) {
            matches.push({ row, col: col - 1 - k });
          }
        }
        count = 1;
      }
    }
    if (count >= 3) {
      for (let k = 0; k < count; k++) {
        matches.push({ row, col: GRID_SIZE - 1 - k });
      }
    }
  }

  // vertical
  for (let col = 0; col < GRID_SIZE; col++) {
    let count = 1;
    for (let row = 1; row < GRID_SIZE; row++) {
      if (grid[row][col] === grid[row - 1][col]) {
        count++;
      } else {
        if (count >= 3) {
          for (let k = 0; k < count; k++) {
            matches.push({ row: row - 1 - k, col });
          }
        }
        count = 1;
      }
    }
    if (count >= 3) {
      for (let k = 0; k < count; k++) {
        matches.push({ row: GRID_SIZE - 1 - k, col });
      }
    }
  }

  return matches;
}
