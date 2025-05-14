'use strict';

const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const startButton = document.getElementById('start-button');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

function draw() {
	board.innerHTML = '';
	drawSnake();
	drawFood();
	updateScore();
}

function drawSnake() {
	snake.forEach((segment) => {
		const snakeElement = createGameElement('div', 'snake');
		setPosition(snakeElement, segment);
		board.appendChild(snakeElement);
	});
}

function createGameElement(tag, className) {
	const element = document.createElement(tag);
	element.className = className;
	return element;
}

function setPosition(element, position) {
	element.style.gridColumn = position.x;
	element.style.gridRow = position.y;
}

function drawFood() {
	if (gameStarted) {
		const foodElement = createGameElement('div', 'food');
		setPosition(foodElement, food);
		board.appendChild(foodElement);
	}
}

function generateFood() {
	const x = Math.floor(Math.random() * gridSize) + 1;
	const y = Math.floor(Math.random() * gridSize) + 1;
	return { x, y };
}

function move() {
	const head = { ...snake[0] };
	switch (direction) {
		case 'up': head.y--; break;
		case 'down': head.y++; break;
		case 'left': head.x--; break;
		case 'right': head.x++; break;
	}
	snake.unshift(head);

	if (head.x === food.x && head.y === food.y) {
		food = generateFood();
		increaseSpeed();
		clearInterval(gameInterval);
		gameInterval = setInterval(() => {
			move();
			checkCollision();
			draw();
		}, gameSpeedDelay);
	} else {
		snake.pop();
	}
}

function startGame() {
	gameStarted = true;
	instructionText.style.display = 'none';
	logo.style.display = 'none';
	startButton.style.display = 'none';
	gameInterval = setInterval(() => {
		move();
		checkCollision();
		draw();
	}, gameSpeedDelay);
}

function handleKeyPress(event) {
	if (
		(!gameStarted && event.code === 'Space') ||
		(!gameStarted && event.key === '')
	) {
		startGame();
	} else {
		switch (event.key) {
			case 'ArrowUp': setDirection('up'); break;
			case 'ArrowDown': setDirection('down'); break;
			case 'ArrowLeft': setDirection('left'); break;
			case 'ArrowRight': setDirection('right'); break;
		}
	}
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
	if (gameSpeedDelay > 150) gameSpeedDelay -= 5;
	else if (gameSpeedDelay > 100) gameSpeedDelay -= 3;
	else if (gameSpeedDelay > 50) gameSpeedDelay -= 2;
	else if (gameSpeedDelay > 25) gameSpeedDelay -= 1;
}

function checkCollision() {
	const head = snake[0];
	if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
		resetGame();
	}
	for (let i = 1; i < snake.length; i++) {
		if (head.x === snake[i].x && head.y === snake[i].y) {
			resetGame();
		}
	}
}

function resetGame() {
	updateHighScore();
	stopGame();
	snake = [{ x: 10, y: 10 }];
	food = generateFood();
	direction = 'right';
	gameSpeedDelay = 200;
	updateScore();

	if (window.innerWidth <= 1024) {
		startButton.style.display = 'block';
		instructionText.style.display = 'none';
	} else {
		startButton.style.display = 'none';
		instructionText.style.display = 'block';
	}
}

function updateScore() {
	const currentScore = snake.length - 1;
	score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
	clearInterval(gameInterval);
	gameStarted = false;
	instructionText.style.display = 'block';
	logo.style.display = 'block';
}

function updateHighScore() {
	const currentScore = snake.length - 1;
	if (currentScore > highScore) {
		highScore = currentScore;
		highScoreText.textContent = highScore.toString().padStart(3, '0');
	}
	highScoreText.style.display = 'block';
}

function setDirection(newDirection) {
	const oppositeDirections = {
		up: 'down',
		down: 'up',
		left: 'right',
		right: 'left'
	};
	if (oppositeDirections[newDirection] !== direction) {
		direction = newDirection;
	}
}

// Touch swipe support
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
	touchStartX = e.changedTouches[0].screenX;
	touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
	const deltaX = e.changedTouches[0].screenX - touchStartX;
	const deltaY = e.changedTouches[0].screenY - touchStartY;

	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		if (deltaX > 30) setDirection('right');
		else if (deltaX < -30) setDirection('left');
	} else {
		if (deltaY > 30) setDirection('down');
		else if (deltaY < -30) setDirection('up');
	}
});

// Button controls for mobile & tablet
function addMobileControls() {
	const btnUp = document.getElementById('btn-up');
	const btnDown = document.getElementById('btn-down');
	const btnLeft = document.getElementById('btn-left');
	const btnRight = document.getElementById('btn-right');

	function addControl(button, direction) {
		button.addEventListener('click', () => setDirection(direction));
		button.addEventListener('touchstart', () => setDirection(direction));
	}

	addControl(btnUp, 'up');
	addControl(btnDown, 'down');
	addControl(btnLeft, 'left');
	addControl(btnRight, 'right');
}

addMobileControls();
