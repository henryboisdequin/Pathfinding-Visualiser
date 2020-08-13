const w = window.innerWidth / 72;
const h = window.innerHeight / 16.2;
let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

export const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < w; row++) {
    const currentRow = [];
    for (let col = 0; col < h; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

export const toggleWall = (grid, row, col) => {
  // grid[row][col].isWall = !grid[row][col].isWall;
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

export const toggleStart = (grid, row, col) => {
  grid[row][col].isStart = !grid[row][col].isStart;
};
export const toggleEnd = (grid, row, col) => {
  grid[row][col].isFinish = !grid[row][col].isFinish;
};
