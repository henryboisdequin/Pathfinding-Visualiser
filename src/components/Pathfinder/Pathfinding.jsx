import React from "react";
import Node from "../Node/Node";
import "tachyons";
import {
  dijkstra,
  getNodesInShortestPathOrderD,
} from "../../algorithms/dijkstra";
import { bellmanFord } from "../../algorithms/bellmanFord";
import "./Pathfinding.css";
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
    const { start, end, grid } = this.state;
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
    } = this.state;

    if (!mouseIsPressed) return;

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

  clearWalls() {
    this.componentDidMount();
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
        "Visualizing Dijkstra, a weighted algorithm with guarantees the shortest path.",
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
        "Visualizing Bellman Ford, a weighted algorithm with guarantees the shortest path.",
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

  render() {
    const { grid, mouseIsPressed } = this.state;
    // if (!visualizing) {
    return (
      <>
        {/* <h1 className="title">Pathfinding Visualizer</h1> */}
        <div className="grid">
          <h4>{this.state.message}</h4>
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
            className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-sort"
          >
            Visualize Dijkstra
          </button>
          <button
            onClick={() => this.visualizeBellmanFord()}
            className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-sort"
          >
            Visualize Bellman Ford
          </button>
          <button
            onClick={() => this.clearWalls()}
            className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-sort"
          >
            Clear Walls
          </button>
        </div>
        <h4>
          <a href="https://github.com/henryboisdequin/Pathfinding-Visualiser">
            Pathfinding Visualizer
          </a>{" "}
          by Henry Boisdequin
        </h4>
      </>
    );
  }
}
