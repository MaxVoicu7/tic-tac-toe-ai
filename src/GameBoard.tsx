import React, { useState, useEffect } from "react";
import "./GameBoard.css";

interface GameBoardProps {
  board: (string | null)[];
  setBoard: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  isPlayerTurn: boolean;
  setIsPlayerTurn: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  setBoard,
  isPlayerTurn,
  setIsPlayerTurn,
}) => {
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

  const minimax = (
    boardState: Array<string | null>,
    player: string
  ): number => {
    const winner = checkWinner(boardState);
    if (winner === "X") return -10;
    if (winner === "O") return 10;
    if (boardState.every((cell) => cell !== null)) return 0;

    const moves = boardState.reduce((acc: number[], cell, index) => {
      if (cell === null) {
        const newBoard = [...boardState];
        newBoard[index] = player;
        const score = minimax(newBoard, player === "O" ? "X" : "O");
        acc.push(score);
      }
      return acc;
    }, []);

    return player === "O" ? Math.max(...moves) : Math.min(...moves);
  };

  const findBestMove = (boardState: Array<string | null>): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    boardState.forEach((cell, index) => {
      if (cell === null) {
        const newBoard = [...boardState];
        newBoard[index] = "O";
        const score = minimax(newBoard, "X");
        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
    });

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
