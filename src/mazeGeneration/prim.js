import { grid } from "../components/Pathfinder/Pathfinding";

export function prim() {
  let maze = getAllNodes(grid);
  // Columns
  for (let i = 0; i < 49; i++) {
    for (let j = 0; j < 20; j++) {
      maze[i][j].isWall = !maze[i][j].isWall;
    }
  }

  let cell = {
    x: Math.floor(Math.random() * 49),
    y: Math.floor(Math.random() * 20),
  };
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
