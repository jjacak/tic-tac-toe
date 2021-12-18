const editBtns = document.querySelectorAll('.fa-edit');
const startBtn = document.querySelector('.start-btn');
const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const editNameInput = document.querySelector('#name-input');
const saveNameBtn = document.querySelector('.save-name-btn');
const editNamePopup = document.querySelector('.edit-name-popup');
const closePopupBtn = document.querySelector('.close-btn');
const gameEndMsg = document.querySelector('.game-end-msg');

class Player {
	constructor(playerNumber, defaultName, symbol) {
		this.playerNumber = playerNumber;
		this.defaultName = defaultName;
		this.name = defaultName;
		this.symbol = symbol;
		this.playersCells = [];
		this.playerDiv = document.querySelector(`.player${this.playerNumber}`);
		this.nameDisplay = document.querySelector(`.player${this.playerNumber}-name`);
	}

	reset() {
		this.playersCells = [];
	}
}

const player1 = new Player('1', 'player 1', 'o');
const player2 = new Player('2', 'player 2', 'x');

const gameState = {
	isActive: false,
	cellsClicked: 0,
	activePlayer: player1,
	playerToEdit: null,
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
		cell.innerText='';
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
	player1.playerDiv.classList.remove('active');
	player2.playerDiv.classList.remove('active');
	gameState.activePlayer.playerDiv.classList.add('active');
}

function markCell() {
	this.classList.add('cell-clicked');
    this.innerText = gameState.activePlayer.symbol;
    gameState.activePlayer.playersCells.push(this.dataset.cellNumber);
	
}

function cellClicked() {
	if (!gameState.isActive) {
		return
	}
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
	gameState.playerToEdit =
		this.dataset.playerToEdit === 'player1' ? player1 : player2;

	editNameInput.value = gameState.playerToEdit.name;
}

function editName() {
	gameState.playerToEdit.name =
		editNameInput.value.trim() || gameState.playerToEdit.name;
	gameState.playerToEdit.nameDisplay.innerText = gameState.playerToEdit.name;

	hidePopup();
}

function hidePopup() {
	editNamePopup.classList.add('hidden');
}

startBtn.addEventListener('click', startGame);
cells.forEach((cell) => cell.addEventListener('click', cellClicked));
editBtns.forEach((btn) => btn.addEventListener('click', showPopup));
saveNameBtn.addEventListener('click', editName);
closePopupBtn.addEventListener('click', hidePopup);



