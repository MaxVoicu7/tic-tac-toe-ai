import "./App.css";
import GameBoard from "./GameBoard";

function App() {
  return (
    <div className="app-container">
      <div className="game-board">
        <GameBoard />
      </div>
      <div className="game-tree">{/* GameTree component will go here */}</div>
    </div>
  );
}

export default App;
