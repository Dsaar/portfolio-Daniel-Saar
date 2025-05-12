import TileMap from "./tileMap.js";
import movingDirection from "./movingDirection.js";


//variables
const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileMap = new TileMap(tileSize);
const pacMan = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio('sound/gameOver.wav');
const gameWinSound = new Audio('sound/gameWin.wav');


function gameLoop() {
	//console.log('gameloop')
	tileMap.draw(ctx);
	drawGameEnd();
	pacMan.draw(ctx, pause(), enemies);
	enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacMan));
	checkGameOver();
	checkGameWin();

}

function checkGameWin() {
	if (!gameWin) {
		gameWin = tileMap.didWin();
		if (gameWin) {
			gameWinSound.play();
		}
	}
}

function checkGameOver() {
	if (!gameOver) {
		gameOver = isGameOver();
		if (gameOver) {
			gameOverSound.play();
		}
	}
}

function isGameOver() {
	return enemies.some((enemy) => !pacMan.powerDotActive && enemy.collideWith(pacMan));

}

function pause() {
	return !pacMan.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
	if (gameOver || gameWin) {
		let text = 'You Win';
		if (gameOver) {
			text = 'Game Over';
		}

		ctx.fillStyle = 'black';
		ctx.fillRect(0, canvas.height / 3.2, canvas.clientWidth, 80);

		ctx.font = '80px comic sans';
		const gradient = ctx.createLinearGradient(0, 0, canvas.clientWidth, 0);
		gradient.addColorStop('0', 'magenta');
		gradient.addColorStop('0.5', 'blue');
		gradient.addColorStop('1.0', 'red');

		ctx.fillStyle = gradient;
		ctx.fillText(text, 10, canvas.height / 2);

	}
}
tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);



// Touch control for mobile
let touchStartX = null;
let touchStartY = null;

canvas.addEventListener("touchstart", function (e) {
	const touch = e.touches[0];
	touchStartX = touch.clientX;
	touchStartY = touch.clientY;
}, false);

canvas.addEventListener("touchend", function (e) {
	if (touchStartX === null || touchStartY === null) return;

	const touch = e.changedTouches[0];
	const dx = touch.clientX - touchStartX;
	const dy = touch.clientY - touchStartY;

	// Determine swipe direction
	if (Math.abs(dx) > Math.abs(dy)) {
		if (dx > 30) {
			pacMan.requestedMovingDirection = movingDirection.right;
		} else if (dx < -30) {
			pacMan.requestedMovingDirection = movingDirection.left;
		}
	} else {
		if (dy > 30) {
			pacMan.requestedMovingDirection = movingDirection.down;
		} else if (dy < -30) {
			pacMan.requestedMovingDirection = movingDirection.up;
		}
	}

	pacMan.madeFirstMove = true;

	// Reset touch start
	touchStartX = null;
	touchStartY = null;
}, false);



//Game Reset

document.getElementById("restartButton").addEventListener("click", restartGame);

function restartGame() {
	gameOver = false;
	gameWin = false;

	// Reset canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Reset map and entities
	tileMap.reset();
	const newPacman = tileMap.getPacman(velocity)
	pacMan.x = newPacman.x
	pacMan.y = newPacman.y
	pacMan.reset();

	const newEnemies = tileMap.getEnemies(velocity);
	enemies.length = 0;
	enemies.push(...newEnemies);
	//tileMap.getEnemies(velocity).forEach(e => enemies.push(e)); // <-- recreate
}

// Start Modal Logic
document.getElementById("startButton").addEventListener("click", function () {
	document.getElementById("startModal").style.display = "none";
});

