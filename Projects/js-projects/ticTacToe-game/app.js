'use strict';

//variables
let cells = document.querySelectorAll('.cell');
let playerTurn = document.querySelector('.playerTurn');
let restart = document.querySelector('.restart');
let modeToggle = document.querySelector('.modeToggle');

let player = 'X';
let gameActive = true;
let vsComputer = false;

// Winning combinations
const winPatterns = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
	[0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
	[0, 4, 8], [2, 4, 6]             // Diagonals
];

function checkWinner() {
	for (let pattern of winPatterns) {
		let [a, b, c] = pattern;
		if (
			cells[a].innerText &&
			cells[a].innerText === cells[b].innerText &&
			cells[a].innerText === cells[c].innerText
		) {
			cells[a].style.backgroundColor = '#90EE90';
			cells[b].style.backgroundColor = '#90EE90';
			cells[c].style.backgroundColor = '#90EE90';
			playerTurn.innerText = `Winner: ${cells[a].innerText}!`;
			gameActive = false;
			return true;
		}
	}

	// Check for tie
	if ([...cells].every(cell => cell.innerText !== '')) {
		playerTurn.innerText = "It's a tie!";
		gameActive = false;
		return true;
	}

	return false;
}

function makeMove(cell) {
	if (!gameActive || cell.innerText !== '') return;

	cell.innerText = player;

	if (checkWinner()) return;

	player = player === 'X' ? 'O' : 'X';
	playerTurn.innerText = `Turn: ${player}`;

	if (vsComputer && player === 'O' && gameActive) {
		setTimeout(computerMove, 500); // slight delay for realism
	}
}

//computer funtionality 
function computerMove() {
	let availableCells = Array.from(cells).filter(c => c.innerText === '');
	if (availableCells.length === 0) return;

	let choice = availableCells[Math.floor(Math.random() * availableCells.length)];
	choice.innerText = player;

	if (checkWinner()) return;

	player = player === 'X' ? 'O' : 'X';
	playerTurn.innerText = `Turn: ${player}`;
}

// Add click event to each cell
cells.forEach(cell => {
	cell.addEventListener('click', () => makeMove(cell));
});

// Restart button
restart.addEventListener('click', () => {
	cells.forEach(cell => {
		cell.innerText = "";
		cell.style.backgroundColor = "#222";
	});
	player = 'X';
	playerTurn.innerText = 'Turn: X';
	gameActive = true;
});

// Mode toggle button
modeToggle.addEventListener('click', () => {
	vsComputer = !vsComputer;
	modeToggle.innerText = vsComputer ? "Mode: Play vs Computer" : "Mode: Play vs Friend";
	restart.click();
});
