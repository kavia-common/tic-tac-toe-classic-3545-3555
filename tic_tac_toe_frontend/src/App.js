import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// Square component
function Square({ value, onClick, disabled, highlight }) {
  return (
    <button
      className={
        'ttt-square' +
        (highlight ? ' ttt-square-highlight' : '') +
        (value ? ' ttt-square-filled' : '')
      }
      onClick={onClick}
      disabled={disabled || value}
      aria-label={value ? `Cell with ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

// Board component
function Board({ squares, onSquareClick, winningLine, gameOver }) {
  function renderSquare(i) {
    const highlight = winningLine && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        disabled={gameOver}
        highlight={highlight}
      />
    );
  }
  let rows = [];
  for (let row = 0; row < 3; row++) {
    let cols = [];
    for (let col = 0; col < 3; col++) {
      cols.push(renderSquare(row * 3 + col));
    }
    rows.push(
      <div className="ttt-board-row" key={row}>
        {cols}
      </div>
    );
  }
  return <div className="ttt-board">{rows}</div>;
}

// Status display component
function Status({ status, currentPlayer, gameOver }) {
  let statusColor;
  if (gameOver) {
    if (status === 'Draw') statusColor = 'ttt-status-draw';
    else if (status.startsWith('Winner')) statusColor = 'ttt-status-win';
    else statusColor = '';
  } else {
    statusColor = 'ttt-status-turn';
  }
  return (
    <div className={`ttt-status ${statusColor}`}>
      {gameOver
        ? status === 'Draw'
          ? 'Draw!'
          : status
        : `Current turn: `}
      {!gameOver && (
        <span className="ttt-status-player">
          {currentPlayer}
        </span>
      )}
    </div>
  );
}

// Helper to check winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Cols
    [0, 4, 8],
    [2, 4, 6], // Diags
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    ) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [winningLine, setWinningLine] = useState(null);

  // Theme toggle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Compute game state
  useEffect(() => {
    const result = calculateWinner(squares);
    if (result) {
      setStatusText(`Winner: ${result.winner}`);
      setGameOver(true);
      setWinningLine(result.line);
    } else if (squares.every(Boolean)) {
      setStatusText('Draw');
      setGameOver(true);
      setWinningLine(null);
    } else {
      setStatusText('');
      setGameOver(false);
      setWinningLine(null);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = idx => {
    if (squares[idx] || gameOver) return;
    const next = squares.slice();
    next[idx] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setStatusText('');
    setGameOver(false);
    setWinningLine(null);
  };

  // For accessibility, status for screen readers
  let ariaStatus;
  if (gameOver && statusText === 'Draw') {
    ariaStatus = 'The game is a draw.';
  } else if (gameOver && statusText.startsWith('Winner')) {
    ariaStatus = `${statusText}`;
  } else {
    ariaStatus = xIsNext ? "X's turn" : "O's turn";
  }

  return (
    <div className="App" role="main">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 className="ttt-title">
          <img src={logo} alt="Tic Tac Toe" className="ttt-logo" /> Tic Tac Toe
        </h1>
        <div className="ttt-game-area">
          <Status
            status={statusText}
            currentPlayer={xIsNext ? 'X' : 'O'}
            gameOver={gameOver}
          />
          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            winningLine={winningLine}
            gameOver={gameOver}
          />
          <button className="ttt-reset-btn" onClick={handleReset}>
            Reset Game
          </button>
        </div>
        <div className="ttt-footer">
          <span
            className="ttt-visually-hidden"
            aria-live="polite"
          >
            {ariaStatus}
          </span>
        </div>
      </header>
    </div>
  );
}

export default App;
