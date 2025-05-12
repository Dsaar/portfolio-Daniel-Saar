import movingDirection from "./movingDirection.js";
export default class Enemy {
	constructor(x, y, tileSize, velocity, tileMap) {
		this.x = x;
		this.y = y;
		this.tileSize = tileSize;
		this.velocity = velocity;
		this.tileMap = tileMap;
		this.startX = x;
		this.startY = y;

		this.#loadImages();

		this.movingDirection = Math.floor(Math.random() * Object.keys(movingDirection).length);

		this.directionTimerDefault = this.#random(1, 10);
		this.directionTimer = this.directionTimerDefault;


		this.scaredABoutToExpireTimerDefault = 20;
		this.scaredABoutToExpireTimer = this.scaredABoutToExpireTimerDefault;
	}
	draw(ctx, pause, pacMan) {
		if (!pause) {
			this.#move();
			this.#changeDirection();
		}
		this.#setImage(ctx, pacMan);
	}
	#setImage(ctx, pacMan) {
		if (pacMan.powerDotActive) {
			this.#setImageWhenPowerDotIsActive(pacMan);
		} else {
			this.image = this.normalGhost;
		}
		ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize)

	}

	collideWith(pacMan) {
		const size = this.tileSize / 2;
		if (this.x < pacMan.x + size &&
			this.x + size > pacMan.x &&
			this.y < pacMan.y + size &&
			this.y + size > pacMan.y
		) {
			return true;
		} else {
			return false;
		}
	}

	reset() {
		this.x = this.startX;
		this.y = this.startY;
		this.movingDirection = Math.floor(Math.random() * Object.keys(movingDirection).length);
		this.directionTimer = this.directionTimerDefault;
		this.scaredABoutToExpireTimer = this.scaredABoutToExpireTimerDefault;
	}

	#setImageWhenPowerDotIsActive(pacMan) {
		if (pacMan.powerDotAboutToExpire) {
			this.scaredABoutToExpireTimer--;
			if (this.scaredABoutToExpireTimer === 0) {
				this.scaredABoutToExpireTimer = this.scaredABoutToExpireTimerDefault;
				if (this.image == this.scaredGhost) {
					this.image = this.scaredGhost2;
				} else {
					this.image = this.scaredGhost;
				}
			}
		} else {
			this.image = this.scaredGhost;
		}

	}

	#changeDirection() {
		this.directionTimer--;

		if (this.directionTimer > 0) return;

		this.directionTimer = this.directionTimerDefault;

		const newMoveDirection = Math.floor(Math.random() * Object.keys(movingDirection).length);

		// Only consider changing direction if we're aligned to the grid
		if (
			Number.isInteger(this.x / this.tileSize) &&
			Number.isInteger(this.y / this.tileSize)
		) {
			if (
				newMoveDirection !== this.movingDirection &&
				!this.tileMap.didCollideWithEnvironment(this.x, this.y, newMoveDirection)
			) {
				this.movingDirection = newMoveDirection;
			}
		}
	}


	#move() {
		if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, this.movingDirection)) {
			switch (this.movingDirection) {
				case movingDirection.up:
					this.y -= this.velocity;
					break;

				case movingDirection.down:
					this.y += this.velocity;
					break;

				case movingDirection.left:
					this.x -= this.velocity;
					break;

				case movingDirection.right:
					this.x += this.velocity;
					break;


			}
		}
	}

	#random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	#loadImages() {
		this.normalGhost = new Image();
		this.normalGhost.src = 'images/ghost.png';

		this.scaredGhost = new Image();
		this.scaredGhost.src = 'images/scaredGhost.png'

		this.scaredGhost2 = new Image();
		this.scaredGhost2.src = 'images/scaredGhost2.png'


		this.image = this.normalGhost
	}
}