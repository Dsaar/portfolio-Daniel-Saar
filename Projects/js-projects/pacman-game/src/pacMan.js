import movingDirection from "./movingDirection.js";
export default class pacMan {
	constructor(x, y, tileSize, velocity, tileMap) {
		this.x = x;
		this.y = y;
		this.tileSize = tileSize;
		this.velocity = velocity;
		this.tileMap = tileMap;

		//starting position storing 
		this.startX = x;
		this.startY = y;

		this.currentMovingDirection = null;
		this.requestedMovingDirection = null;

		this.pacManAnimationTimerDefault = 10;
		this.pacManAnimationTimer = null;

		this.pacManRotation = this.Rotation.right;
		this.wakaSound = new Audio('sound/waka.wav');

		this.powerDotSound = new Audio('sound/power_dot.wav');
		this.powerDotActive = false;
		this.powerDotAboutToExpire = false;
		this.timers = [];

		this.eatGhostSound = new Audio('sound/eat_ghost.wav')

		this.madeFirstMove = false;

		document.addEventListener('keydown', this.#keydown)

		this.#loadPacmanImages();
	}

	Rotation = {
		right: 0,
		down: 1,
		left: 2,
		up: 3
	}


	draw(ctx, pause, enemies) {
		if (!pause) {
			this.#move();
			this.#animate();
		}
		this.#eatDot();
		this.#eatPowerDot();
		this.#eatGhost(enemies);

		const size = this.tileSize / 2;

		ctx.save();
		ctx.translate(this.x + size, this.y + size);
		ctx.rotate((this.pacManRotation * 90 * Math.PI / 180));
		ctx.drawImage(this.pacManImages[this.pacManImageIndex], -size, -size, this.tileSize, this.tileSize);
		ctx.restore();
		//ctx.drawImage(this.pacManImages[this.pacManImageIndex], this.x, this.y, this.tileSize, this.tileSize)
	}

	reset() {
		this.x = this.startX;
		this.y = this.startY;
		this.currentMovingDirection = null;
		this.requestedMovingDirection = null;
		this.madeFirstMove = false;
		this.powerDotActive = false;
		this.powerDotAboutToExpire = false;
		this.timers.forEach((t) => clearTimeout(t));
		this.timers = [];
	}

	#loadPacmanImages() {
		const pacManImage1 = new Image();
		pacManImage1.src = 'images/pac0.png';

		const pacManImage2 = new Image();
		pacManImage2.src = 'images/pac1.png';

		const pacManImage3 = new Image();
		pacManImage3.src = 'images/pac2.png';

		const pacManImage4 = new Image();
		pacManImage4.src = 'images/pac1.png';


		this.pacManImages = [pacManImage1, pacManImage2, pacManImage3, pacManImage4];

		this.pacManImageIndex = 0;
	}

	#keydown = (event) => {
		//up
		if (event.keyCode == 38 || event.keyCode == 87) {
			if (this.currentMovingDirection == movingDirection.down)
				this.currentMovingDirection = movingDirection.up;
			this.requestedMovingDirection = movingDirection.up;
			this.madeFirstMove = true;
		}
		//down
		if (event.keyCode == 40 || event.keyCode == 83) {
			if (this.currentMovingDirection == movingDirection.up)
				this.currentMovingDirection = movingDirection.down;
			this.requestedMovingDirection = movingDirection.down;
			this.madeFirstMove = true;
		}
		//left
		if (event.keyCode == 37 || event.keyCode == 65) {
			if (this.currentMovingDirection == movingDirection.right)
				this.currentMovingDirection = movingDirection.left;
			this.requestedMovingDirection = movingDirection.left;
			this.madeFirstMove = true;
		}
		//right
		if (event.keyCode == 39 || event.keyCode == 68) {
			if (this.currentMovingDirection == movingDirection.left)
				this.currentMovingDirection = movingDirection.right;
			this.requestedMovingDirection = movingDirection.right;
			this.madeFirstMove = true;
		}
	};


	#move() {
		if (this.currentMovingDirection !== this.requestedMovingDirection) {
			if (Number.isInteger(this.x / this.tileSize) &&
				Number.isInteger(this.y / this.tileSize)) {
				if (
					!this.tileMap.didCollideWithEnvironment(
						this.x,
						this.y,
						this.requestedMovingDirection
					)
				)

					this.currentMovingDirection = this.requestedMovingDirection;
			}
		}


		if (this.tileMap.didCollideWithEnvironment(this.x, this.y, this.currentMovingDirection)) {
			this.pacManAnimationTimer = null;
			this.pacManImageIndex = 1;
			return;
		} else if (this.currentMovingDirection != null && this.pacManAnimationTimer == null) {
			this, this.pacManAnimationTimer = this.pacManAnimationTimerDefault;
		}

		switch (this.currentMovingDirection) {
			case movingDirection.up:
				this.y -= this.velocity;
				this.pacManRotation = this.Rotation.up;
				break;

			case movingDirection.down:
				this.y += this.velocity;
				this.pacManRotation = this.Rotation.down;

				break;

			case movingDirection.left:
				this.x -= this.velocity;
				this.pacManRotation = this.Rotation.left;

				break;

			case movingDirection.right:
				this.x += this.velocity;
				this.pacManRotation = this.Rotation.right;

				break;
		}
	}

	#animate() {
		if (this.pacManAnimationTimer == null) {
			return
		}
		this.pacManAnimationTimer--;
		if (this.pacManAnimationTimer == 0) {
			this.pacManAnimationTimer = this.pacManAnimationTimerDefault;
			this.pacManImageIndex++;
			if (this.pacManImageIndex == this.pacManImages.length)
				this.pacManImageIndex = 0;
		}

	}

	#eatDot() {
		if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) {
			//play sound
			this.wakaSound.play();
		}
	}

	#eatPowerDot() {
		if (this.tileMap.eatPowerDot(this.x, this.y)) {
			this.powerDotSound.play();

			this.powerDotActive = true;
			this.powerDotAboutToExpire = false;

			this.timers.forEach((timer) => clearTimeout(timer));
			this.timers = [];

			let powerDotTimer = setTimeout(() => {
				this.powerDotActive = false;
				this.powerDotAboutToExpire = false;
			}, 1000 * 6)

			this.timers.push(powerDotTimer);

			let powerDotAboutToExpireTimer = setTimeout(() => {
				this.powerDotAboutToExpire = true;
			}, 1000 * 3);

			this.timers.push(powerDotAboutToExpireTimer);
			//the ghost will turn blue


		}
	}

	#eatGhost(enemies) {
		if (this.powerDotActive) {
			const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
			collideEnemies.forEach((enemy) => {
				enemies.splice(enemies.indexOf(enemy), 1);
				this.eatGhostSound.play();
			});
		}
	}
}