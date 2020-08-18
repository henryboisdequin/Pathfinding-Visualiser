const w = 20;
const h = 49;
export const START_NODE_ROW = 10;
export const START_NODE_COL = 15;
export const FINISH_NODE_ROW = 10;
export const FINISH_NODE_COL = 35;

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
    weight: 0,
  };
};

export const toggleWall = (grid, row, col) => {
  grid[row][col].isWall = !grid[row][col].isWall;
};

export const toggleStart = (grid, row, col) => {
  grid[row][col].isStart = !grid[row][col].isStart;
};
export const toggleEnd = (grid, row, col) => {
  grid[row][col].isFinish = !grid[row][col].isFinish;
};

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
