const editBtns = document.querySelectorAll('.fa-edit');
const player1Div = document.querySelector('.player1');
const player2Div = document.querySelector('.player2');
const player1Name = document.querySelector('.name-p1');
const player2Name = document.querySelector('.name-p2');
const startBtn = document.querySelector('.start-btn');
const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const editNameInput = document.querySelector('#name-input');
const saveNameBtn = document.querySelector('.save-name-btn');
const editNamePopup = document.querySelector('.edit-name-popup');
const closePopupBtn = document.querySelector('.close-btn');
const gameEndMsg = document.querySelector('.game-end-msg');

class Player {
	constructor(defaultName) {
		(this.defaultName = defaultName),
			(this.name = defaultName),
			(this.playersCells = []);
	}

	reset() {
		this.playersCells = [];
	}
}

const player1 = new Player('player 1');
const player2 = new Player('player 2');

const gameState = {
	isActive: false,
	cellsClicked: 0,
	activePlayer: player1,
	nameToEdit: null,
	winningCombinations: [
		['1', '2', '3'],
		['4', '5', '6'],
		['7', '8', '9'],
		['1', '4', '7'],
		['2', '5', '8'],
		['3', '6', '9'],
		['1', '5', '9'],
		['3', '5', '7'],
	],
	checkForWin: function () {
		let win = false;
		this.winningCombinations.forEach((c) => {
			if (c.every((num) => this.activePlayer.playersCells.includes(num))) {
				win = true;
				this.isActive = false;
			}
		});
		return win;
	},
	checkForGameEnd: function () {
		if (this.cellsClicked === 9) {
			this.isActive = false;
			return true;
		} else {
			return false;
		}
	},
};

function startGame() {
	gameState.isActive = true;
    gameState.activePlayer = player1;
	player1.reset();
	player2.reset();
	gameState.cellsClicked = 0;
	cells.forEach((cell) => {
		cell.classList.remove('cell-clicked');
		cell.classList.remove('cell-clicked-p1');
		cell.classList.remove('cell-clicked-p2');
	});

	board.classList.remove('hidden');
	gameEndMsg.classList.add('hidden');
	displayActive();
}

function changeActive() {
	gameState.activePlayer =
		gameState.activePlayer == player1 ? player2 : player1;
}

function displayActive() {
	if (gameState.activePlayer == player1) {
		player1Div.classList.add('active');
		player2Div.classList.remove('active');
	} else {
		player2Div.classList.add('active');
		player1Div.classList.remove('active');
	}
}


function markCell() {
	this.classList.add('cell-clicked');

	if (gameState.activePlayer == player1) {
		this.classList.add('cell-clicked-p1');
		player1.playersCells.push(this.dataset.cellNumber);
	} else {
		this.classList.add('cell-clicked-p2');
		player2.playersCells.push(this.dataset.cellNumber);
	}
}

function cellClicked() {
	if (gameState.isActive) {
        
		markCell.apply(this);
		gameState.cellsClicked++;

		if (gameState.checkForWin()) {
			displayMessage(gameState.activePlayer);
			return;
		} else if (gameState.checkForGameEnd()) {
			displayMessage();
			return;
		}
		changeActive();
		displayActive();
	}
}

function displayMessage(player) {
	if (player) {
     
		gameEndMsg.innerHTML = `<strong>${player.name}</strong> wins! Click the button to start a new game.`;
	} else {
		gameEndMsg.innerHTML = `It's a tie. Click the button to start a new game.`;
	}
	gameEndMsg.classList.remove('hidden');
}

function showPopup() {
	editNamePopup.classList.remove('hidden');
	gameState.nameToEdit = this.dataset.playerToEdit;
	editNameInput.value =
		gameState.nameToEdit === 'player1' ? player1.name : player2.name;
}

function editName() {
	if (gameState.nameToEdit === 'player1') {
		player1.name = editNameInput.value || player1.name;
		player1Name.innerText = player1.name;
	} else {
		player2.name = editNameInput.value || player2.name;
		player2Name.innerText = player2.name;
	}

	editNamePopup.classList.add('hidden');
}
//todo:
//1.fn to close popup

startBtn.addEventListener('click', startGame);
cells.forEach((cell) => cell.addEventListener('click', cellClicked));
editBtns.forEach((btn) => btn.addEventListener('click', showPopup));
saveNameBtn.addEventListener('click', editName);
