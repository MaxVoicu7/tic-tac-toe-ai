import React, { useState, useEffect } from "react";
import "./GameBoard.css";

const GameBoard: React.FC = () => {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);

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

  const checkDraw = (board: Array<string | null>): boolean => {
    return board.every((cell) => cell !== null) && !checkWinner(board);
  };

  const getAvailableMoves = (board: Array<string | null>): number[] => {
    return board.reduce((moves: number[], cell, index) => {
      if (cell === null) moves.push(index);
      return moves;
    }, []);
  };

  const minimax = (
    boardState: Array<string | null>,
    player: string
  ): number => {
    const availableMoves = getAvailableMoves(boardState);
    const winner = checkWinner(boardState);

    if (winner === "X") return -10;
    if (winner === "O") return 10;
    if (availableMoves.length === 0) return 0;

    const moves = availableMoves.map((index) => {
      const newBoard = [...boardState];
      newBoard[index] = player;
      const score = minimax(newBoard, player === "O" ? "X" : "O");
      return { index, score };
    });

    return player === "O"
      ? Math.max(...moves.map((m) => m.score))
      : Math.min(...moves.map((m) => m.score));
  };

  const findBestMove = (boardState: Array<string | null>): number => {
    const availableMoves = getAvailableMoves(boardState);
    let bestScore = -Infinity;
    let bestMove = -1;

    for (const move of availableMoves) {
      const newBoard = [...boardState];
      newBoard[move] = "O";
      const score = minimax(newBoard, "X");
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const bestMove = findBestMove(board);
        if (bestMove !== -1) {
          const newBoard = [...board];
          newBoard[bestMove] = "O";
          setBoard(newBoard);
          setIsPlayerTurn(true);

          const newWinner = checkWinner(newBoard);
          if (newWinner) {
            setWinner(newWinner);
          } else if (checkDraw(newBoard)) {
            setIsDraw(true);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner, isDraw]);

  const handleClick = (index: number) => {
    if (board[index] === null && isPlayerTurn && !winner && !isDraw) {
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);

      const currentWinner = checkWinner(newBoard);
      if (currentWinner) {
        setWinner(currentWinner);
      } else if (checkDraw(newBoard)) {
        setIsDraw(true);
      } else {
        setIsPlayerTurn(false);
      }
    }
  };

  return (
    <div className="board-container">
      <h1 className="board-title">Tic Tac Toe AI</h1>
      <div className="board">
        {board.map((value, index) => (
          <div
            key={index}
            className={`cell ${value === "X" ? "x-cell" : ""} ${
              value === "O" ? "o-cell" : ""
            }`}
            onClick={() => handleClick(index)}
          >
            {value}
          </div>
        ))}
      </div>
      {winner && <h2 className="winner">Winner: {winner}</h2>}
      {isDraw && <h2 className="winner">Game ended in a draw!</h2>}
    </div>
  );
};

export default GameBoard;
