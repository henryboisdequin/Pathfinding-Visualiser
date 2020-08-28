import { toggleWeight } from "../helper";

export function weightMaze(grid) {
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 49; col++) {
      let random = Math.random();
      if (
        (random <= 0.1 || random >= 0.85) &&
        !grid[row][col].isStart &&
        !grid[row][col].isEnd
      ) {
        toggleWeight(grid, row, col);
      }
    }
  }
}
