import { toggleWall } from "../helper";

export function recursiveDivision(grid) {
  addInnerWalls(grid, true, 1, 47, 1, 17);
  addOuterWalls(grid, 49, 20);
}

function addOuterWalls(grid, width, height) {
  for (var i = 0; i < height; i++) {
    if (i === 0 || i === height - 1) {
      for (var j = 0; j < width; j++) {
        if (!grid[i][j].isWall) toggleWall(grid, i, j);
      }
    } else {
      if (!grid[i][0].isWall) toggleWall(grid, i, 0);
      if (!grid[i][width - 1].isWall) toggleWall(grid, i, width - 1);
    }
  }
}

function addInnerWalls(grid, h, minX, maxX, minY, maxY) {
  if (h) {
    if (maxX - minX < 2) {
      return;
    }

    var y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
    addHWall(grid, minX, maxX, y);

    addInnerWalls(grid, !h, minX, maxX, minY, y - 1);
    addInnerWalls(grid, !h, minX, maxX, y + 1, maxY);
  } else {
    if (maxY - minY < 2) {
      return;
    }

    var x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
    addVWall(grid, minY, maxY, x);

    addInnerWalls(grid, !h, minX, x - 1, minY, maxY);
    addInnerWalls(grid, !h, x + 1, maxX, minY, maxY);
  }
}

function addHWall(grid, minX, maxX, y) {
  var hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;
  var hole2 = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;
  for (var i = minX; i <= maxX; i++) {
    if (i === hole || i === hole2) continue;
    toggleWall(grid, y, i);
  }
}

function addVWall(grid, minY, maxY, x) {
  var hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;
  var hole2 = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;
  for (var i = minY; i <= maxY; i++) {
    if (i === hole || i === hole2) continue;
    toggleWall(grid, i, x);
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
