'use strict';

const section = document.querySelector('section');
const playerLivesCount = document.querySelector('span');
let playerLives = 10;

// link to text
playerLivesCount.textContent = playerLives;

// Modal elements
const modal = document.getElementById('resultModal');
const resultText = document.getElementById('resultText');
const closeButton = document.querySelector('.close-button');
const restartButton = document.getElementById('restartButton');

// generate data
const getData = () => [
	{ imgSrc: './images/alien.png', name: 'alien' },
	{ imgSrc: './images/ball.png', name: 'ball' },
	{ imgSrc: './images/bracket.png', name: 'bracket' },
	{ imgSrc: './images/heart.png', name: 'heart' },
	{ imgSrc: './images/leaf.png', name: 'leaf' },
	{ imgSrc: './images/music.png', name: 'music' },
	{ imgSrc: './images/present.png', name: 'present' },
	{ imgSrc: './images/star.png', name: 'star' },
	{ imgSrc: './images/alien.png', name: 'alien' },
	{ imgSrc: './images/ball.png', name: 'ball' },
	{ imgSrc: './images/bracket.png', name: 'bracket' },
	{ imgSrc: './images/heart.png', name: 'heart' },
	{ imgSrc: './images/leaf.png', name: 'leaf' },
	{ imgSrc: './images/music.png', name: 'music' },
	{ imgSrc: './images/present.png', name: 'present' },
	{ imgSrc: './images/star.png', name: 'star' },
];

// randomize
const randomize = () => {
	const cardData = getData();
	cardData.sort(() => Math.random() - 0.5);
	return cardData;
};

// card generator function
const cardGenerator = () => {
	// Clear previous cards if any
	section.innerHTML = '';

	const cardData = randomize();

	cardData.forEach((item) => {
		const card = document.createElement('div');
		const face = document.createElement('img');
		const back = document.createElement('div');

		card.classList = 'card';
		face.classList = 'face';
		back.classList = 'back';

		// attach info to cards
		face.src = item.imgSrc;
		card.setAttribute('name', item.name);

		// attach cards to the section
		section.appendChild(card);
		card.appendChild(face);
		card.appendChild(back);

		card.addEventListener('click', (e) => {
			card.classList.toggle('toggleCard');
			checkCards(e);
		});
	});
};

// check cards
const checkCards = (e) => {
	const clickedCard = e.target;
	clickedCard.classList.add('flipped');

	const flippedCards = document.querySelectorAll('.flipped');
	const toggleCard = document.querySelectorAll('.toggleCard');

	// logic
	if (flippedCards.length === 2) {
		if (
			flippedCards[0].getAttribute('name') ===
			flippedCards[1].getAttribute('name')
		) {
			flippedCards.forEach((card) => {
				card.classList.remove('flipped');
				card.style.pointerEvents = 'none';
			});
		} else {
			flippedCards.forEach((card) => {
				card.classList.remove('flipped');
				setTimeout(() => card.classList.remove('toggleCard'), 2000);
			});
			playerLives--;
			playerLivesCount.textContent = playerLives;

			if (playerLives === 0) {
				restart('YOU LOSE!');
			}
		}
	}

	// check for win
	if (toggleCard.length === 16) {
		restart('YOU WON!');
	}
};

// restart
const restart = (text) => {
	let cardData = randomize();
	let faces = document.querySelectorAll('.face');
	let cards = document.querySelectorAll('.card');
	section.style.pointerEvents = 'none';

	cardData.forEach((item, index) => {
		cards[index].classList.remove('toggleCard');
		setTimeout(() => {
			cards[index].style.pointerEvents = 'all';
			faces[index].src = item.imgSrc;
			cards[index].setAttribute('name', item.name);
			section.style.pointerEvents = 'all';
		}, 1000);
	});

	playerLives = 10;
	playerLivesCount.textContent = playerLives;

	// Show modal instead of alert
	setTimeout(() => {
		resultText.textContent = text;
		modal.style.display = 'flex';
	}, 1000);
};

// Modal controls
closeButton.onclick = () => {
	modal.style.display = 'none';
};

restartButton.onclick = () => {
	modal.style.display = 'none';
	cardGenerator();
};

// initialize the game
cardGenerator();
