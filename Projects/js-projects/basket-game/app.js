'use strict';

class Basket {
	constructor(element) {
		this.element = element;
		this.left = 250;
		this.updateScreen();
	}
	moveLeft() {
		if (this.left > 10) {
			this.left -= 20;
			this.updateScreen();
		}
	}
	moveRight() {
		if (this.left < 490) {
			this.left += 20;
			this.updateScreen();
		}
	}
	updateScreen() {
		this.element.style.left = this.left + 'px';
	}
}

class Present {
	constructor(gameArea, basket, type = 'gift') {
		this.type = type;
		this.x = Math.floor(Math.random() * 560);
		this.y = 0;
		this.gameArea = gameArea;
		this.basket = basket;

		this.element = document.createElement('div');
		this.element.className = type === 'gift' ? 'present' : 'coal';
		this.element.style.left = this.x + 'px';
		this.gameArea.appendChild(this.element);
	}

	fall() {
		this.y += 2;
		this.element.style.top = this.y + 'px';

		if (this.y > 600) {
			this.element.remove();
			return false;
		}

		const basketRect = this.basket.element.getBoundingClientRect();
		const itemRect = this.element.getBoundingClientRect();

		const isColliding = !(
			basketRect.top > itemRect.bottom ||
			basketRect.bottom < itemRect.top ||
			basketRect.left > itemRect.right ||
			basketRect.right < itemRect.left
		);

		if (isColliding) {
			this.element.remove();
			if (this.type === 'gift') {
				score++;
			} else if (this.type === 'coal') {
				score = Math.max(0, score - 1); // Prevent negative score
			}
			scoreDisplay.textContent = "Score: " + score;
			return false;
		}

		return true;
	}
}

let myBasket = document.getElementById('basket');
let b = new Basket(myBasket);
let score = 0;
let scoreDisplay = document.getElementById('score');

let highScore = localStorage.getItem('highScore') || 0;
let highScoreDisplay = document.getElementById('highScore');
highScoreDisplay.textContent = "High Score: " + highScore;

// Keyboard controls
document.addEventListener('keydown', (event) => {
	if (event.key === 'ArrowLeft') b.moveLeft();
	if (event.key === 'ArrowRight') b.moveRight();
});

// Swipe gesture support for mobile
let touchStartX = null;
let touchEndX = null;

function handleSwipe() {
	if (touchStartX === null || touchEndX === null) return;

	const swipeDistance = touchEndX - touchStartX;

	if (Math.abs(swipeDistance) > 30) {
		if (swipeDistance > 0) {
			b.moveRight();
		} else {
			b.moveLeft();
		}
	}

	touchStartX = null;
	touchEndX = null;
}

document.addEventListener('touchstart', (e) => {
	touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
	touchEndX = e.changedTouches[0].screenX;
	handleSwipe();
}, false);

let gameArea = document.getElementById('gameArea');
let presents = [];

let spawnInterval, fallInterval;

document.getElementById('startGameBtn').addEventListener('click', () => {
	document.getElementById('startModal').style.display = 'none';
	startGame();
});

function startGame() {
	spawnInterval = setInterval(() => {
		const type = Math.random() < 0.8 ? 'gift' : 'coal'; // 80% gift, 20% coal
		let p = new Present(gameArea, b, type);
		presents.push(p);
	}, 1500);

	fallInterval = setInterval(() => {
		presents = presents.filter((p) => p.fall());
	}, 40);
}

// Save high score on pagehide
window.addEventListener('pagehide', () => {
	if (score > highScore) {
		localStorage.setItem('highScore', score);
	}
});

// Reset high score
const resetButton = document.getElementById('resetHighScoreBtn');
resetButton.addEventListener('click', () => {
	localStorage.removeItem('highScore');
	highScore = 0;
	highScoreDisplay.textContent = "High Score: 0";
});
