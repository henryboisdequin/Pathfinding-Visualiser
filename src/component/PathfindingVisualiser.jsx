import React from "react";
import Node from "./Node/Node";
import "tachyons";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import "./Pathfinding.css";
import { getInitialGrid, toggleWall, toggleStart, toggleEnd } from "../helper";

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

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
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const { start, end } = this.state;
    if (row === start[0] && col === start[1]) {
      this.setState({ movingStart: true, mouseIsPressed: true });
    } else if (row === end[0] && col === end[1]) {
      this.setState({ movingEnd: true, mouseIsPressed: true });
    } else {
      this.setState({
        grid: toggleWall(this.state.grid, row, col),
        mouseIsPressed: true,
      });
    }
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
      this.setState({ grid: toggleWall(grid, row, col) });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
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
    const grid = getInitialGrid();
    this.setState({ grid });
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
    const { grid, start, end } = this.state;
    this.setState({ visualizing: true });
    const startNode = grid[start[0]][start[1]];
    const finishNode = grid[end[0]][end[1]];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    setTimeout(() => {
      this.setState({ visualizing: false });
    }, 10000);
  }

  render() {
    const { grid, mouseIsPressed, visualizing } = this.state;
    console.log(this.state);
    if (!visualizing) {
      return (
        <>
          <div className="grid">
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
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
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
              Visualize Dijkstra's Algorithm
            </button>
            <button
              onClick={() => this.clearWalls()}
              className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-sort"
            >
              Clear Walls
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="grid">
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
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
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
              disabled
              className="f6 no-underline br-pill ph3 pv2 mb2 dib white bg-light-green button-sort"
            >
              Visualize Dijkstra's Algorithm
            </button>
            <button
              onClick={() => this.clearWalls()}
              className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-light-red button-sort"
            >
              Clear Walls
            </button>
          </div>
        </>
      );
    }
  }
}
