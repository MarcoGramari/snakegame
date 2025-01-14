import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const gridSize = 20; // Tamanho do grid (20x20)
const initialSnake = [{ x: 5, y: 5 }];
const initialFood = { x: 10, y: 10 };

const App = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  // Função para gerar uma posição válida para a comida (não pode estar onde está a cobra)
  const generateFoodPosition = () => {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)); // Garante que a comida não apareça na cobra
    return newFoodPosition;
  };

  // Função para mover a cobra
  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const head = { ...snake[0] };

    // Mover a cabeça da cobra
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

    // Verificando se a cobra colidiu com a borda ou com ela mesma
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

    // Verificar se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
      // Reposicionar a comida
      setFood(generateFoodPosition());
    } else {
      // Remover a cauda (cabeça nova já foi adicionada)
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver]);

  // Função para capturar a tecla pressionada
  const handleKeyPress = (event) => {
    if (gameOver) return;

    // A cobra não pode ir para a direção contrária
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

    // Intervalo de movimento da cobra (100ms para aumentar a velocidade)
    const interval = setInterval(moveSnake, 100);

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

  // Função para reiniciar o jogo
  const restartGame = () => {
    setSnake(initialSnake);
    setFood(generateFoodPosition()); // Garante que a comida não apareça no corpo da cobra
    setDirection('RIGHT');
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <h1>Jogo da Cobrinha</h1>
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
