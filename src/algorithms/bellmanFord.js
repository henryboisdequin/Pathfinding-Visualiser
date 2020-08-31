export function bellmanFord(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const nodes = getAllNodes(grid);
  startNode.previousNode = null;
  startNode.distance = 0;
  let visited = new Array(19 * 49).fill(false);
  for (let i = 0; i < 19 * 49 - 1; i++) {
    for (const node of nodes) {
      if (node.isWall) continue;
      if (node.weight) continue;
      const neighbors = getUnvisitedNeighbors(node, grid);
      const { row, col } = node;
      if (!visited[row * 49 + col] && neighbors.length > 0) {
        visitedNodesInOrder.push(node);
        visited[row * 49 + col] = !visited[row * 49 + col];
      }
      for (const neighbor of neighbors) {
        let newDistance = node.distance + neighbor.weight;
        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previousNode = node;
        }
      }
    }
  }
  return [visitedNodesInOrder, getNodesInShortestPathOrderBF(finishNode)];
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function getNodesInShortestPathOrderBF(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

function getUnvisitedNeighbors(node, grid) {
  let neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  neighbors = neighbors.filter((neighbor) => !neighbor.isVisited);
  return neighbors.filter((neighbor) => !neighbor.isWall);
}
