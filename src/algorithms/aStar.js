export function aStar(grid, startNode, finishNode) {
  const unvisitedNodes = [];
  const visitedNodesInOrder = [];
  startNode.isVisited = true;
  startNode.previousNode = null;
  unvisitedNodes.push(startNode);
  visitedNodesInOrder.push(startNode);
  while (unvisitedNodes.length) {
    let currentNode = unvisitedNodes.pop();
    if (currentNode.isWall) continue;
    if (currentNode === finishNode) return visitedNodesInOrder;
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);
    let neighbors = getUnvisitedNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      neighbor.previousNode = currentNode;
      unvisitedNodes.push(neighbor);
    }
  }
  return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function heuristic(currentNode, finishNode) {
  // Euclidean Distance
  const { row, col } = currentNode;
  const xCoords = Math.pow(finishNode.col - col, 2);
  const yCoords = Math.pow(finishNode.row - row, 2);

  return Math.sqrt(xCoords + yCoords);
}
