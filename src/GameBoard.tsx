import React, { useState, useEffect, useRef } from 'react';
import './GameBoard.css';

// Define the Coordinate type for snake and food positions
type Coordinate = {
  x: number;
  y: number;
};
// Define const for the board size, initial snake position, and direction
const BOARD_SIZE = 10;
const INITIAL_SNAKE: Coordinate[] = [{ x: 2, y: 2 }];
const INITIAL_DIRECTION: Coordinate = { x: 1, y: 0 };
// Define the GameBoard component
const GameBoard: React.FC = () => {
  // States to manage the snake, direction, food, and game over status
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Coordinate>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Coordinate>(getRandomFood());
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
// Event listeners and game loop
  useEffect(() => {
    console.log('Component mounted');
    window.addEventListener('keydown', handleKeyPress);
    gameLoopRef.current = setInterval(moveSnake, 200);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [snake, direction]);
// Function to generate a random food position that does not overlap with the snake
  function getRandomFood(): Coordinate {
    let newFood: Coordinate;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }
// Function for key presses to change the snake's direction
  function handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
    }
  }
// Function to move the snake and check for collisions and food
  function moveSnake() {
    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    console.log('Moving Snake. Head:', head);

    if (head.x < 0 || head.y < 0 || head.x >= BOARD_SIZE || head.y >= BOARD_SIZE || newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      return;
    }

    newSnake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomFood());
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }

  return (
    <div>
      {gameOver ? (
        <h1>Game Over!!! (Refresh to restart)</h1>
      ) : (
        <div className="game-board">
          {Array.from({ length: BOARD_SIZE }).map((_, y) => (
            <div key={y} className="row">
              {Array.from({ length: BOARD_SIZE }).map((_, x) => (
                <div
                  key={x}
                  className={`cell ${snake.some(segment => segment.x === x && segment.y === y) ? 'snake' : ''} ${food.x === x && food.y === y ? 'food' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
