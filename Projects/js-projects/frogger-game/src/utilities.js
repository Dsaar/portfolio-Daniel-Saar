'use strict';

let gameStarted = false;

function animate() {
	ctx1.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas.width, canvas.height);
	ctx3.clearRect(0, 0, canvas.width, canvas.height);
	ctx4.clearRect(0, 0, canvas.width, canvas.height);
	ctx5.clearRect(0, 0, canvas.width, canvas.height);

	handleRipples();
	ctx2.drawImage(background_lvl2, 0, 0, canvas.width, canvas.height);
	handleParticles();
	frogger.draw();
	frogger.update();

	handleObstacles();
	handleScoreBoard();
	ctx4.drawImage(grass, 0, 0, canvas.width, canvas.height);
	frame++;
	requestAnimationFrame(animate);
}

//animate();

// Keyboard controls
window.addEventListener('keydown', function (e) {
	keys = [];
	keys[e.keyCode] = true;
	if (keys[37] || keys[38] || keys[39] || keys[40]) {
		frogger.jump();
	}
});

window.addEventListener('keyup', function (e) {
	delete keys[e.keyCode];
	frogger.moving = false;
	frogger.frameX = 0;
})

function scored() {
	score++;
	gameSpeed += 0.05;
	frogger.x = canvas.width / 2 - frogger.width / 2;
	frogger.y = canvas.height - frogger.height - 40;
}

function handleScoreBoard() {
	ctx4.fillStyle = 'black';
	ctx4.strokeStyle = 'black';
	ctx4.font = `${canvas.height * 0.025}px Verdana`;
	ctx4.strokeText('Score:', canvas.width * 0.44, canvas.height * 0.025);
	ctx4.font = `${canvas.height * 0.1}px Verdana`;
	ctx4.fillText(score, canvas.width * 0.45, canvas.height * 0.11);
	ctx4.font = `${canvas.height * 0.025}px Verdana`;
	ctx4.strokeText('Collisions:' + collisionCount, canvas.width * 0.015, canvas.height * 0.29);
	ctx4.strokeText('Game Speed:' + gameSpeed.toFixed(1), canvas.width * 0.015, canvas.height * 0.325);
}

function collision(first, second) {
	return !(first.x > second.x + second.width ||
		first.x + first.width < second.x ||
		first.y > second.y + second.height ||
		first.y + first.height < second.y);
}

function resetGame() {
	frogger.x = canvas.width / 2 - frogger.width / 2;
	frogger.y = canvas.height - frogger.height - 40;
	score = 0;
	collisionCount++;
	gameSpeed = 1;
}

// Mobile touch controls
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('touchstart', function (e) {
	touchStartX = e.changedTouches[0].clientX;
	touchStartY = e.changedTouches[0].clientY;
}, false);

window.addEventListener('touchend', function (e) {
	if (!gameStarted) return;

	const dx = e.changedTouches[0].clientX - touchStartX;
	const dy = e.changedTouches[0].clientY - touchStartY;

	keys = [];

	if (Math.abs(dx) > Math.abs(dy)) {
		keys[dx > 0 ? 39 : 37] = true; // Right : Left
	} else {
		keys[dy > 0 ? 40 : 38] = true; // Down : Up
	}

	frogger.jump();

	setTimeout(() => {
		keys = [];
		frogger.moving = false;
		frogger.frameX = 0;
	}, 100);
});

const modal = document.getElementById('gameModal');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', () => {
	modal.style.display = 'none';
	gameStarted = true;
	animate();
});

// Prevent double animate() on reload
window.onload = () => {
	cancelAnimationFrame(frame);
};
