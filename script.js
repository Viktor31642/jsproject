const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const startMenu = document.getElementById('start-menu');
const startBtn = document.getElementById('start-btn');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const scoreDisplay = document.getElementById('score');
const difficultySelect = document.getElementById('difficulty');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let dx;
let dy;
let isGameOver;
let score;

let speed = Number(difficultySelect.value);
let lastRenderTime = 0;

difficultySelect.addEventListener('change', () => {
  speed = Number(difficultySelect.value);
});

function initGame() {
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 15 };
  dx = 1; // рух одразу вправо
  dy = 0;
  isGameOver = false;
  score = 0;
  scoreDisplay.textContent = 'Score: 0';
  lastRenderTime = 0;
}

function main(currentTime) {
  if (isGameOver) return;

  window.requestAnimationFrame(main);

  const secondsSinceLastRender = currentTime - lastRenderTime;

  if (secondsSinceLastRender < speed) return;

  lastRenderTime = currentTime;

  gameLoop();
}

function gameLoop() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    endGame();
    return;
  }

  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    score++;
    scoreDisplay.textContent = 'Score: ' + score;
  } else {
    snake.pop();
  }

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = 'lime';
  snake.forEach(part => {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  });
}

function endGame() {
  isGameOver = true;
  gameOverScreen.style.display = 'block';
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && dy === 0) {
    dx = 0; dy = -1;
  } else if (e.key === 'ArrowDown' && dy === 0) {
    dx = 0; dy = 1;
  } else if (e.key === 'ArrowLeft' && dx === 0) {
    dx = -1; dy = 0;
  } else if (e.key === 'ArrowRight' && dx === 0) {
    dx = 1; dy = 0;
  }
});

startBtn.onclick = () => {
  initGame();
  startMenu.style.display = 'none';
  window.requestAnimationFrame(main);
};

restartBtn.onclick = () => {
  initGame();
  gameOverScreen.style.display = 'none';
  window.requestAnimationFrame(main);
};
