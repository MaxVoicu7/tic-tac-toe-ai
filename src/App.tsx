import "./App.css";
import GameBoard from "./GameBoard";
import GameTree from "./GameTree";
import { useState } from "react";

function App() {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  return (
    <div className="app-container">
      <div className="game-board">
        <GameBoard
          board={board}
          setBoard={setBoard}
          isPlayerTurn={isPlayerTurn}
          setIsPlayerTurn={setIsPlayerTurn}
        />
      </div>
      <div className="game-tree">
        <GameTree board={board} currentPlayer={isPlayerTurn ? "X" : "O"} />
      </div>
    </div>
  );
}

export default App;
