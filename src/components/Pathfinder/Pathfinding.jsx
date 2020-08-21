import React from "react";
import Node from "../Node/Node";
import "tachyons";
import {
  dijkstra,
  getNodesInShortestPathOrderD,
} from "../../algorithms/dijkstra";
import { bellmanFord } from "../../algorithms/bellmanFord";
import { bfs, getNodesInShortestPathOrderBFS } from "../../algorithms/bfs";
import "./Pathfinding.css";
import { simpleMaze } from "../../mazeGeneration/simpleMaze";
import { recursiveDivision } from "../../mazeGeneration/recursiveDivision";
import { prim } from "../../mazeGeneration/prim";
import {
  getInitialGrid,
  toggleWall,
  toggleStart,
  toggleEnd,
  START_NODE_ROW,
  START_NODE_COL,
  FINISH_NODE_ROW,
  FINISH_NODE_COL,
} from "../../helper";

export default class PathfindingVisualiser extends React.Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      movingStart: false,
      movingEnd: false,
      start: [START_NODE_ROW, START_NODE_COL],
      end: [FINISH_NODE_ROW, FINISH_NODE_COL],
      visualizing: false,
      message: "Pick an Algorithm to Visualize!",
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const { start, end, grid, visualizing } = this.state;
    if (visualizing) return;
    if (row === start[0] && col === start[1]) {
      this.setState({ movingStart: true });
    } else if (row === end[0] && col === end[1]) {
      this.setState({ movingEnd: true });
    } else {
      toggleWall(this.state.grid, row, col);
    }
    this.setState({
      grid: grid,
      mouseIsPressed: true,
    });
  }

  handleMouseEnter(row, col) {
    const {
      mouseIsPressed,
      movingStart,
      movingEnd,
      start,
      end,
      grid,
      visualizing,
    } = this.state;

    if (!mouseIsPressed) return;
    if (visualizing) return;

    if (movingStart) {
      toggleStart(grid, row, col);
      toggleStart(grid, start[0], start[1]);
      this.setState({
        start: [row, col],
        movingStart: true,
      });
    } else if (movingEnd) {
      toggleEnd(grid, row, col);
      toggleEnd(grid, end[0], end[1]);
      this.setState({ end: [row, col], movingEnd: true });
    } else {
      toggleWall(grid, row, col);
    }
    this.setState({ grid: grid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateMaze(nodesInMaze) {
    for (let i = 0; i <= nodesInMaze.length; i++) {
      setTimeout(() => {
        const node = nodesInMaze[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-wall";
      }, 10 * i);
    }
  }

  clearGrid() {
    const { visualizing } = this.state;
    const message = "Pick an Algorithm to Visualize!";
    if (visualizing) return;
    this.unvisitNodes(
      true,
      [START_NODE_ROW, START_NODE_COL],
      [FINISH_NODE_ROW, FINISH_NODE_COL]
    );
    this.setState({
      start: [START_NODE_ROW, START_NODE_COL],
      end: [FINISH_NODE_ROW, FINISH_NODE_COL],
      message,
    });
  }

  unvisitNodes(removeWalls, start, end) {
    const { grid } = this.state;
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 49; col++) {
        let node = grid[row][col];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node ";
        node.isVisited = false;
        node.previousNode = null;
        node.distance = Infinity;
        node.weight = 0;
        if (removeWalls) {
          node.isWall = false;
        } else if (node.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-wall";
        }
        if (row === start[0] && col === start[1]) {
          document.getElementById(`node-${start[0]}-${start[1]}`).className =
            "node node-start";
          node.isStart = true;
        }
        if (row === end[0] && col === end[1]) {
          document.getElementById(`node-${end[0]}-${end[1]}`).className =
            "node node-finish";
          node.isFinish = true;
        }
      }
    }
    this.setState({ grid: grid, visualizing: false });
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    this.setState({
      message:
        "Visualizing Dijkstra, a weighted algorithm which guarantees the shortest path.",
    });
    const { grid, start, end } = this.state;
    this.setState({ visualizing: true });
    const startNode = grid[start[0]][start[1]];
    const finishNode = grid[end[0]][end[1]];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderD(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    setTimeout(() => {
      this.setState({ visualizing: false });
    }, 10000);
  }

  visualizeBellmanFord() {
    this.setState({
      message:
        "Visualizing Bellman Ford, a weighted algorithm which guarantees the shortest path.",
    });
    const { grid, start, end } = this.state;
    this.setState({ visualizing: true });
    const startNode = grid[start[0]][start[1]];
    const finishNode = grid[end[0]][end[1]];
    const visitedNodesInOrder = bellmanFord(grid, startNode, finishNode)[0];
    const nodesInShortestPathOrder = bellmanFord(
      grid,
      startNode,
      finishNode
    )[1];
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    setTimeout(() => {
      this.setState({ visualizing: false });
    }, 10000);
  }

  visualizeBFS() {
    this.setState({
      message:
        "Visualizing BFS, an unweighted algorithm which guarantees the shortest path.",
    });
    const { grid, start, end } = this.state;
    this.setState({ visualizing: true });
    const startNode = grid[start[0]][start[1]];
    const finishNode = grid[end[0]][end[1]];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderBFS(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    setTimeout(() => {
      this.setState({ visualizing: false });
    }, 10000);
  }

  visualizeSimpleMaze() {
    const { grid, start, end } = this.state;
    this.unvisitNodes(true, start, end);
    simpleMaze(grid);
  }

  visualizeRecursiveDivision() {
    const { grid, start, end } = this.state;
    this.unvisitNodes(true, start, end);
    recursiveDivision(grid);
  }

  visualizePrim() {
    const { grid, start, end } = this.state;
    this.unvisitNodes(true, start, end);
    // const mazeNodes = prim(grid);
    prim(grid);
    // this.animateMaze(mazeNodes);
  }

  render() {
    const { grid, mouseIsPressed, message } = this.state;
    // if (!visualizing) {
    return (
      <>
        {/* <h1 className="title">Pathfinding Visualizer</h1> */}
        <div className="grid">
          <h4>{message}</h4>
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    />
                  );
                })}
              </div>
            );
          })}
          <button
            onClick={() => this.visualizeDijkstra()}
            className="button f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-font"
          >
            Visualize Dijkstra
          </button>
          <button
            onClick={() => this.visualizeBellmanFord()}
            className="button f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-font"
          >
            Visualize Bellman Ford
          </button>
          <button
            onClick={() => this.visualizeBFS()}
            className="button f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-font"
          >
            Visualize BFS
          </button>
          <button
            onClick={() => this.visualizeSimpleMaze()}
            className="button f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-font"
          >
            Simple Maze
          </button>
          <button
            onClick={() => this.visualizeRecursiveDivision()}
            className="button f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-font"
          >
            Recursive Division
          </button>
          <button
            onClick={() => this.visualizePrim()}
            className="button f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-font"
          >
            Prim
          </button>
          <button
            onClick={() => this.clearGrid()}
            className="button f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-font"
          >
            Clear Grid
          </button>
        </div>
        <h4>
          <a
            className="button"
            href="https://github.com/henryboisdequin/Pathfinding-Visualiser"
          >
            Pathfinding Visualizer
          </a>{" "}
          by Henry Boisdequin
        </h4>
      </>
    );
  }
}
