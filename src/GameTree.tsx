import React, { useState, useEffect } from "react";
import "./GameTree.css";

interface AIMove {
  moveNumber: number;
  board: (string | null)[];
  bestMove: number;
  bestScore: number;
  evaluatedMoves: { index: number; score: number }[];
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

  useEffect(() => {
    if (currentPlayer === "O") {
      const availableMoves = getAvailableMoves(board);
      const evaluatedMoves = availableMoves.map((index) => {
        const newBoard = [...board];
        newBoard[index] = "O";
        const score = calculateScore(newBoard);
        return { index, score };
      });

      const bestMove = evaluatedMoves.reduce((best, current) =>
        current.score > best.score ? current : best
      );

      const newAiMove: AIMove = {
        moveNumber: aiMoveHistory.length + 1,
        board: [...board],
        bestMove: bestMove.index,
        bestScore: bestMove.score,
        evaluatedMoves,
      };

      setAiMoveHistory((prev) => [...prev, newAiMove]);
    }
  }, [board, currentPlayer]);

  return (
    <div className="game-tree">
      <h2 className="tree-title">AI Move History</h2>
      <div className="ai-history">
        {aiMoveHistory.map((move, index) => (
          <div key={index} className="ai-move-container">
            <div className="move-header">
              <h3>AI Move #{move.moveNumber}</h3>
            </div>
            <div className="best-move">
              <h4>Selected Move: Position {move.bestMove + 1}</h4>
              <div className="score">Score: {move.bestScore}</div>
            </div>
            <div className="evaluated-moves">
              <h4>Evaluated Positions:</h4>
              <div className="moves-grid">
                {move.evaluatedMoves.map(({ index, score }) => (
                  <div
                    key={index}
                    className={`move-evaluation ${
                      index === move.bestMove ? "best-choice" : ""
                    }`}
                  >
                    <div className="position">Position {index + 1}</div>
                    <div className="score">Score: {score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameTree;
