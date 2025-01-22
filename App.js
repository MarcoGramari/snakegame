import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

let gridSize = 12; 
let initialSnake = [{ x: 5, y: 5 }];
let initialFood = { x: 6, y: 3 }; 

let App = () => {
  let [snake, setSnake] = useState(initialSnake);
  let [food, setFood] = useState(initialFood);
  let [direction, setDirection] = useState('');
  let [gameOver, setGameOver] = useState(false);
  let [score, setScore] = useState(0);
  let [started, setStarted] = useState(false);

  let generateFoodPosition = () => {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)); 
    return newFoodPosition;
  };

  let moveSnake = useCallback(() => {
    if (gameOver || !started) return;

    let head = { ...snake[0] };

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

    let newSnake = [head, ...snake];

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFoodPosition());
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, score, started]);

  let handleKeyPress = (event) => {
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

    let interval = setInterval(moveSnake, 200); 
    return () => clearInterval(interval);
  }, [moveSnake, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  let renderGrid = () => {
    let cells = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        let isSnake = snake.some(segment => segment.x === col && segment.y === row);
        let isFood = food.x === col && food.y === row;
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

  let restartGame = () => {
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
