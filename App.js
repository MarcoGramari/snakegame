import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const gridSize = 12; 
const initialSnake = [{ x: 5, y: 5 }];
const initialFood = { x: 6, y: 3 }; 

const App = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  const generateFoodPosition = () => {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)); 
    return newFoodPosition;
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !started) return;

    const head = { ...snake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    if (
      head.x < 0 ||
      head.x >= gridSize ||
      head.y < 0 ||
      head.y >= gridSize ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    const newSnake = [head, ...snake];

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFoodPosition());
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, score, started]);

  const handleKeyPress = (event) => {
    if (gameOver) return;

    if (!started) {
      setStarted(true);
    }

    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(moveSnake, 200); 
    return () => clearInterval(interval);
  }, [moveSnake, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const renderGrid = () => {
    let cells = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const isSnake = snake.some(segment => segment.x === col && segment.y === row);
        const isFood = food.x === col && food.y === row;
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
          />
        );
      }
    }
    return cells;
  };

  const restartGame = () => {
    setSnake(initialSnake);
    setFood(generateFoodPosition()); 
    setDirection('');
    setGameOver(false);
    setScore(0);
    setStarted(false);
  };

  return (
    <div className="game-container">
      <h1>Jogo da Cobrinha</h1>
      <div className="score">Pontuação: {score}</div>
      {gameOver && (
        <div>
          <div className="game-over">Fim de Jogo!</div>
          <button onClick={restartGame} className="restart-button">Reiniciar</button>
        </div>
      )}
      <div className="grid">{renderGrid()}</div>
    </div>
  );
};

export default App;
