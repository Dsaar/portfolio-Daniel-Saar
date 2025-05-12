'use strict';

//selecting elements from the HTML variables

const wordDisplay = document.querySelector('.word-display');
const guessesText = document.querySelector('.guesses-text b');
const keyboardDiv = document.querySelector('.keyboard');
const hangmanImage = document.querySelector('.hangman-box img');
const gameModal = document.querySelector('.game-modal');
const playAgainBtn = gameModal.querySelector('button');


//initialize the game variables

let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

//reset game function
const resetGame = () => {
	correctLetters = [];
	wrongGuessCount = 0;
	hangmanImage.src = 'images/hangman-0.svg';
	guessesText.innerText = `${wrongGuessCount}/${maxGuesses}`;
	//create the empty letter slots 
	wordDisplay.innerHTML = currentWord.split('').map(() => `<li class="letter"></li>`).join('');
	//enable keyboard buttons
	keyboardDiv.querySelectorAll('button').forEach(btn => btn.disabled = false)
	//hide the game modal
	gameModal.classList.remove('show');
}

//function to get a random word and set uo game 
const getRandomWord = () => {
	//picking a random word and hint from word list array
	const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
	//set the current word and update the hint
	currentWord = word;
	document.querySelector('.hint-text b').innerText = hint;
	//call reset game
	resetGame();
}

//function that handles end of game win or lose
const gameOver = (isVictory) => {
	//show the game over modal with win or lose
	const modalText = isVictory ? `You Found The Word:` : `The Correct Word Was : `;
	gameModal.querySelector('img').src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
	gameModal.querySelector('h4').innerText = isVictory ? 'Congrats!' : 'Game Over!';
	gameModal.querySelector('p').innerHTML = `${modalText} <b>${currentWord}</b>`;
	gameModal.classList.add('show');

}


//creating a for loop to display keyboard buttons 
for (let i = 97; i <= 122; i++) {
	const button = document.createElement('button');
	button.innerText = String.fromCharCode(i);
	keyboardDiv.appendChild(button);
	//adding a click event lisiner for each button
	button.addEventListener('click', (e) => initGame(e.target, String.fromCharCode(i)));

}

//function to handle game logic when letter is clicked
const initGame = (button, clickedLetter) => {
	//checking if the clicked letter is in the current word
	if (currentWord.includes(clickedLetter)) {
		//update the displayed letter if clicked is correct
		[...currentWord].forEach((letter, index) => {
			if (letter === clickedLetter) {
				correctLetters.push(letter);
				wordDisplay.querySelectorAll('li')[index].innerText = letter;
				wordDisplay.querySelectorAll('li')[index].classList.add('guessed')
			}
		});
	} else {
		//update wrong guess count and hangman image if letter is inccorect
		wrongGuessCount++;
		hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
	}
	//disable the clicked button so it can't be clicked again 
	button.disabled = true;
	//update displayed guess count
	guessesText.innerText = `${wrongGuessCount}/${maxGuesses}`;
	//check if the game should end based on win or lose conditions 
	if (wrongGuessCount === maxGuesses) return gameOver(false);
	if (correctLetters.length === currentWord.length) return gameOver(true);
}


//starting the game with a random word
getRandomWord();


//add event listner for play again button

playAgainBtn.addEventListener('click',getRandomWord);
