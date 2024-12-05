import React, { useState, useEffect } from "react";
import "./GameTree.css";

interface AIMove {
  moveNumber: number;
  board: (string | null)[];
  bestMove: number;
  bestScore: number;
  treeNodes: TreeNode[];
}

interface TreeNode {
  position: number;
  board: (string | null)[];
  score: number;
  children: TreeNode[];
}

interface GameTreeProps {
  board: (string | null)[];
  currentPlayer: "X" | "O";
}

const GameTree: React.FC<GameTreeProps> = ({ board, currentPlayer }) => {
  const [aiMoveHistory, setAiMoveHistory] = useState<AIMove[]>([]);

  const calculateScore = (
    boardState: (string | null)[],
    depth: number = 0
  ): number => {
    const winner = checkWinner(boardState);
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (boardState.every((cell) => cell !== null)) return 0;

    const isMax = depth % 2 === 0;
    const nextPlayer = isMax ? "O" : "X";
    const moves = getAvailableMoves(boardState).map((index) => {
      const newBoard = [...boardState];
      newBoard[index] = nextPlayer;
      return calculateScore(newBoard, depth + 1);
    });

    return isMax ? Math.max(...moves) : Math.min(...moves);
  };

  const checkWinner = (board: Array<string | null>) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const getAvailableMoves = (boardState: (string | null)[]): number[] => {
    return boardState.reduce((moves: number[], cell, index) => {
      if (cell === null) moves.push(index);
      return moves;
    }, []);
  };

  const generateMoveTree = (
    boardState: (string | null)[],
    position: number
  ): TreeNode => {
    const newBoard = [...boardState];
    newBoard[position] = "O";

    // Get immediate responses from player
    const playerMoves = getAvailableMoves(newBoard).map((pos) => {
      const playerBoard = [...newBoard];
      playerBoard[pos] = "X";
      return {
        position: pos,
        board: playerBoard,
        score: calculateScore(playerBoard),
        children: [],
      };
    });

    return {
      position,
      board: newBoard,
      score: calculateScore(newBoard),
      children: playerMoves,
    };
  };

  useEffect(() => {
    if (currentPlayer === "O") {
      const availableMoves = getAvailableMoves(board);
      const treeNodes = availableMoves.map((pos) =>
        generateMoveTree(board, pos)
      );

      const evaluatedMoves = treeNodes.map((node) => ({
        index: node.position,
        score: node.score,
      }));

      const bestMove = evaluatedMoves.reduce((best, current) =>
        current.score > best.score ? current : best
      );

      const newAiMove: AIMove = {
        moveNumber: aiMoveHistory.length + 1,
        board: [...board],
        bestMove: bestMove.index,
        bestScore: bestMove.score,
        treeNodes,
      };

      setAiMoveHistory((prev) => [...prev, newAiMove]);
    }
  }, [board, currentPlayer]);

  const renderTreeNode = (node: TreeNode, isBestMove: boolean) => (
    <div className={`tree-node ${isBestMove ? "best-move" : ""}`}>
      <div className="node-header">
        Position {node.position + 1}
        <div className="node-score">Score: {node.score}</div>
      </div>
      <div className="mini-board">
        {node.board.map((cell, idx) => (
          <div
            key={idx}
            className={`mini-cell ${cell === "X" ? "x-cell" : ""} ${
              cell === "O" ? "o-cell" : ""
            }`}
          >
            {cell}
          </div>
        ))}
      </div>
      {node.children.length > 0 && (
        <div className="possible-responses">
          <div className="responses-label">Possible Player Responses:</div>
          <div className="responses-grid">
            {node.children.map((child, idx) => (
              <div key={idx} className="response-node">
                <div className="mini-board">
                  {child.board.map((cell, cellIdx) => (
                    <div
                      key={cellIdx}
                      className={`mini-cell ${cell === "X" ? "x-cell" : ""} ${
                        cell === "O" ? "o-cell" : ""
                      }`}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
                <div className="node-score">Score: {child.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="game-tree">
      <h2 className="tree-title">AI Decision Tree Analysis</h2>
      <div className="ai-history">
        {aiMoveHistory.map((move, index) => (
          <div key={index} className="ai-move-container">
            <div className="move-header">
              <h3>AI Move #{move.moveNumber}</h3>
            </div>
            <div className="tree-visualization">
              <h4>Decision Tree:</h4>
              <div className="tree-nodes">
                {move.treeNodes.map((node, idx) =>
                  renderTreeNode(node, node.position === move.bestMove)
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameTree;
