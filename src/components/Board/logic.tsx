import { CellGrid, CellValue } from "./types";

export function rotate(grid: CellGrid): CellGrid {
  return grid[0].map((val, index) => grid.map((row) => row[index]).reverse());
}

/**
 * "If there are any empty cells, add a random 2 or 4 to one of them."
 *
 * @param {CellGrid} grid - CellGrid - The grid to add a random cell to
 * @returns A new grid with a random cell value of 2 or 4.
 */
function addRandom(grid: CellGrid): CellGrid {
  let positions = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 0) {
        positions.push({ x: i, y: j });
      }
    }
  }

  if (positions.length > 0) {
    let choice = positions[Math.floor(Math.random() * positions.length)];

    grid[choice.x][choice.y] = ((Math.round(Math.random()) + 1) *
      2) as CellValue;
  }
  return grid;
}

/**
 * Returns true if the two grids are different, and false otherwise.
 * @param {CellGrid} g - the first grid
 * @param {CellGrid} h - the second grid
 * @returns A boolean value.
 */
function didChange(g: CellGrid, h: CellGrid): boolean {
  for (let i = 0; i < g.length; i++) {
    for (let j = 0; j < g[0].length; j++) {
      if (g[i][j] !== h[i][j]) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Perform the 2048 merge to the left.
 *
 * @param {CellGrid} grid - CellGrid
 * @returns A new grid with the values merged and a random value added.
 */
export function mergeLeftAndInsert(grid: CellGrid): CellGrid {
  let newGrid: CellGrid = [];

  for (let row of grid) {
    row = row.filter((element) => element != 0);

    let cursor: number = 0;
    let newRow: Array<CellValue> = [];
    while (cursor != row.length) {
      if (cursor + 1 < row.length && row[cursor] === row[cursor + 1]) {
        newRow.push((row[cursor] + row[cursor]) as CellValue);
        cursor += 1;
      } else {
        newRow.push(row[cursor]);
      }
      cursor += 1;
    }
    while (newRow.length != 4) {
      newRow.push(0);
    }
    newGrid.push(newRow);
  }

  return didChange(grid, newGrid) ? addRandom(newGrid) : newGrid;
}

export function isGameOver(grid: CellGrid): boolean {
  for (let i = 0; i < 4; i++) {
    grid = i > 0 ? rotate(grid) : grid;
    if (didChange(grid, mergeLeftAndInsert(grid))) {
      return false;
    }
  }
  return true;
}

export function didWin(grid: CellGrid): boolean {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === 2048) {
        return true;
      }
    }
  }
  return false;
}
