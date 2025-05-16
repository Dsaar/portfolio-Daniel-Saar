'use strict';

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const enemyHealth = document.querySelector('#enemy-health');
const playerHealth = document.querySelector('#player-health');
const gameTimer = document.querySelector('.timer');
const gameScoreText = document.querySelector('.gameScoreText');

canvas.width = 1024;
canvas.height = 576;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
	position: { x: 0, y: 0 },
	imageSrc: './images/background.png'
});

const shop = new Sprite({
	position: { x: 630, y: 133.5 },
	imageSrc: './images/shop.png',
	scale: 2.75,
	framesMax: 6
});

const player = new Fighter({
	position: { x: 50, y: 0 },
	velocity: { x: 0, y: 10 },
	offset: { x: 0, y: 0 },
	imageSrc: './images/samuraiMack/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: { x: 215, y: 157 },
	sprites: {
		idle: { imageSrc: './images/samuraiMack/Idle.png', framesMax: 8 },
		run: { imageSrc: './images/samuraiMack/Run.png', framesMax: 8 },
		jump: { imageSrc: './images/samuraiMack/Jump.png', framesMax: 2 },
		fall: { imageSrc: './images/samuraiMack/Fall.png', framesMax: 2 },
		attack1: { imageSrc: './images/samuraiMack/Attack1.png', framesMax: 6 },
		takeHit: { imageSrc: './images/samuraiMack/Take Hit - white silhouette.png', framesMax: 4 },
		death: { imageSrc: './images/samuraiMack/Death.png', framesMax: 6 }
	},
	attackBox: {
		offset: { x: 100, y: 50 },
		width: 160,
		height: 50
	}
});

const enemy = new Fighter({
	position: { x: 800, y: 100 },
	velocity: { x: 0, y: 0 },
	color: 'blue',
	offset: { x: -50, y: 0 },
	imageSrc: './images/kenji/Idle.png',
	framesMax: 4,
	scale: 2.5,
	offset: { x: 215, y: 167 },
	sprites: {
		idle: { imageSrc: './images/kenji/Idle.png', framesMax: 4 },
		run: { imageSrc: './images/kenji/Run.png', framesMax: 8 },
		jump: { imageSrc: './images/kenji/Jump.png', framesMax: 2 },
		fall: { imageSrc: './images/kenji/Fall.png', framesMax: 2 },
		attack1: { imageSrc: './images/kenji/Attack1.png', framesMax: 4 },
		takeHit: { imageSrc: './images/kenji/Take hit.png', framesMax: 3 },
		death: { imageSrc: './images/kenji/Death.png', framesMax: 7 }
	},
	attackBox: {
		offset: { x: -170, y: 50 },
		width: 170,
		height: 50
	}
});

const keys = {
	a: { pressed: false },
	d: { pressed: false },
	w: { pressed: false },
	ArrowLeft: { pressed: false },
	ArrowRight: { pressed: false },
	ArrowUp: { pressed: false }
};


function animate() {
	window.requestAnimationFrame(animate);
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	shop.update();
	ctx.fillStyle = 'rgba(255,255,255,0.15)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	if ((keys.a.pressed || keys.ArrowLeft.pressed) && player.lastKey === 'a') {
		player.velocity.x = -5;
		player.switchSprite('run');
	} else if ((keys.d.pressed || keys.ArrowRight.pressed) && player.lastKey === 'd') {
		player.velocity.x = 5;
		player.switchSprite('run');
	} else {
		player.switchSprite('idle');
	}

	if (player.velocity.y < 0) {
		player.switchSprite('jump');
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall');
	}

	// Enemy AI
	if (enemy.dead) {
		enemy.velocity.x = 0;
		enemy.velocity.y = 0;
	} else {
		const distance = Math.abs(player.position.x - enemy.position.x);
		if (!enemy.attackCooldown) enemy.attackCooldown = 0;
		if (!enemy.hitCount) enemy.hitCount = 0;
		if (!enemy.state) enemy.state = 'idle';

		if (distance < 150 && enemy.state !== 'retreat') {
			enemy.velocity.x = 0;
			enemy.switchSprite('idle');

			if (!enemy.isAttacking && enemy.framesCurrent === 0 && enemy.attackCooldown <= 0) {
				enemy.attack();
				enemy.hitCount += 1;

				if (enemy.hitCount >= 3) {
					enemy.state = 'retreat';
					enemy.retreatTimer = 60;
					enemy.hitCount = 0;
				}

				enemy.attackCooldown = 30;
			}
		} else {
			if (enemy.state === 'retreat') {
				enemy.velocity.x = (enemy.position.x < player.position.x) ? -3 : 3;
				enemy.switchSprite('run');
				enemy.retreatTimer--;
				if (enemy.retreatTimer <= 0) {
					enemy.state = 'idle';
				}
			} else {
				if (Math.random() < 0.01) {
					const direction = Math.random() < 0.5 ? -1 : 1;
					enemy.velocity.x = direction * 2;
					enemy.lastDirection = direction;
				} else {
					enemy.velocity.x = enemy.lastDirection || 0;
				}

				if (Math.random() < 0.005 && enemy.velocity.y === 0) {
					enemy.velocity.y = -20;
				}

				enemy.switchSprite(enemy.velocity.x !== 0 ? 'run' : 'idle');
			}
		}

		if (enemy.attackCooldown > 0) {
			enemy.attackCooldown--;
		}

		if (enemy.velocity.y < 0) {
			enemy.switchSprite('jump');
		} else if (enemy.velocity.y > 0) {
			enemy.switchSprite('fall');
		}
	}

	// Collisions and attack resolution
	if (
		rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
		player.isAttacking && player.framesCurrent === 4
	) {
		enemy.takeHit();
		player.isAttacking = false;
		gsap.to(enemyHealth, { width: enemy.health + '%' });
	}

	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false;
	}

	if (
		rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
		enemy.isAttacking && enemy.framesCurrent === 2
	) {
		player.takeHit();
		enemy.isAttacking = false;
		gsap.to(playerHealth, { width: player.health + '%' });
	}

	if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
	}

	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({ player, enemy, timerId });
	}
}

// Keyboard Controls
window.addEventListener('keydown', (event) => {
	if (!player.dead) {
		switch (event.key) {
			case 'd':
			case 'ArrowRight':
				keys.d.pressed = true;
				player.lastKey = 'd';
				break;
			case 'a':
			case 'ArrowLeft':
				keys.a.pressed = true;
				player.lastKey = 'a';
				break;
			case 'w':
			case 'ArrowUp':
				keys.w.pressed = true;
				player.velocity.y = -20;
				break;
			case ' ':
				player.attack();
				break;
		}
	}
});

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':
		case 'ArrowRight':
			keys.d.pressed = false;
			break;
		case 'a':
		case 'ArrowLeft':
			keys.a.pressed = false;
			break;
		case 'w':
		case 'ArrowUp':
			keys.w.pressed = false;
			break;
	}
});

// Orientation Handling
function updateOrientation() {
	if (window.matchMedia("(orientation: landscape)").matches) {
		document.body.classList.add("landscape");
		document.body.classList.remove("portrait");
	} else {
		document.body.classList.add("portrait");
		document.body.classList.remove("landscape");
	}
}

window.addEventListener("load", updateOrientation);
window.addEventListener("orientationchange", updateOrientation);
window.addEventListener("resize", updateOrientation);

// Unified DOMContentLoaded: modal + touch controls + restart
document.addEventListener("DOMContentLoaded", () => {
	const restartBtn = document.getElementById("restartBtn");
	if (restartBtn) {
		restartBtn.addEventListener("click", () => {
			location.reload();
		});
	}

	const modal = document.getElementById("startModal");
	const startBtn = document.getElementById("startBtn");

	startBtn.addEventListener("click", () => {
		decreaseTimer();
		modal.style.display = "none";
		animate();
	});

	const btnLeft = document.getElementById('btnLeft');
	const btnRight = document.getElementById('btnRight');
	const btnJump = document.getElementById('btnJump');
	const btnAttack = document.getElementById('btnAttack');

	if (btnLeft && btnRight && btnJump && btnAttack) {
		btnLeft.addEventListener('touchstart', () => {
			keys.a.pressed = true;
			player.lastKey = 'a';
		});
		btnLeft.addEventListener('touchend', () => {
			keys.a.pressed = false;
		});

		btnRight.addEventListener('touchstart', () => {
			keys.d.pressed = true;
			player.lastKey = 'd';
		});
		btnRight.addEventListener('touchend', () => {
			keys.d.pressed = false;
		});

		btnJump.addEventListener('touchstart', () => {
			player.velocity.y = -20;
		});

		btnAttack.addEventListener('touchstart', () => {
			player.attack();
		});
	}
});
