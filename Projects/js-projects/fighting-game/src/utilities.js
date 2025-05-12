function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	)
}

function determineWinner({ player, enemy, timerId }) {
	clearTimeout(timerId);
	gameScoreText.style.display = 'flex';

	const result = document.getElementById('gameResult');
	const restartBtn = document.getElementById('restartBtn');
	restartBtn.style.display = 'inline-block';

	if (player.health === enemy.health) {
		result.innerHTML = 'Tie';
	} else if (player.health > enemy.health) {
		result.innerHTML = 'Player 1 wins';
	} else {
		result.innerHTML = 'Player 2 wins';
	}
}


let timer = 60
let timerId
function decreaseTimer() {
	if (timer > 0) {
		timerId = setTimeout(decreaseTimer, 1000)
		timer--
		gameTimer.innerHTML = timer
	}
	if (timer === 0) {
		determineWinner({ player, enemy,timerId })
	}
}
