class Grid {
  constructor(){
    this.buildGrid();
  }

  buildGrid() {
    this.main = document.getElementById('main');
    const gridContainer = document.createElement('div');
    const grid = document.createElement('div');
    const row = document.createElement('div');
    const square = document.createElement('div');
    gridContainer.id = 'grid-container';
    grid.classList.add('grid');
    row.classList.add('row');
    square.classList.add('square');
    square.classList.add('unmarked');
    square.textContent = '-';

    for (let i = 0; i < 3; i++) {
      const newRow = row.cloneNode(true);
      for (let j = 0; j < 3; j++) {
        const newSquare = square.cloneNode(true);
        newSquare.id = `${i},${j}`;
        newRow.appendChild(newSquare);
      }
      grid.appendChild(newRow);
    }
    gridContainer.appendChild(grid.cloneNode(true));
    this.main.appendChild(gridContainer.cloneNode(true));
  }

  getSquare(rowNum, colNum) {
    return document.getElementById(`${rowNum},${colNum}`);
  }

  showsWinWith(targetSq, mark) {
    const rowNum = Number(targetSq.id[0]);
    const colNum = Number(targetSq.id[2]);
    const sq = this.getSquare;
    const hasCurMark = this.hasMark(mark);

    switch (colNum) {
      case 0:
        if (
          hasCurMark(sq(rowNum, colNum + 1), sq(rowNum, colNum + 2)) ||
          (rowNum === 0 && hasCurMark(sq(rowNum + 1, colNum + 1), sq(rowNum + 2, colNum + 2))) || // diagonal starting w/ 0,0
          (rowNum === 2 && hasCurMark(sq(rowNum - 1, colNum + 1), sq(rowNum - 2, colNum + 2))) // diagonal starting w/ 2,0
        ) return true;
        break;
      case 1:
        if (
          hasCurMark(sq(rowNum, colNum - 1), sq(rowNum, colNum + 1)) ||
          (rowNum === 1 && hasCurMark(sq(rowNum - 1, colNum - 1), sq(rowNum + 1, colNum + 1))) || // diagonal with 1,1 in the middle
          (rowNum === 1 && hasCurMark(sq(rowNum + 1, colNum - 1), sq(rowNum - 1, colNum + 1))) // diagonal with 1,1 in the middle
        ) return true;
        break;
      case 2:
        if (
          hasCurMark(sq(rowNum, colNum -1), sq(rowNum, colNum - 2)) ||
          (rowNum === 0 && hasCurMark(sq(rowNum + 1, colNum - 1), sq(rowNum + 2, colNum - 2))) || // diagonal starting w/ 0,2
          (rowNum === 2 && hasCurMark(sq(rowNum - 1, colNum -1), sq(rowNum - 2, colNum - 2))) // diagonal starting w/ 2,2
        ) return true;
        break;
    }

    switch (rowNum) {
      case 0:
        if (hasCurMark(sq(rowNum + 1, colNum), sq(rowNum + 2, colNum))) return true;
        break;
      case 1:
        if (hasCurMark(sq(rowNum - 1, colNum), sq(rowNum + 1, colNum))) return true;
        break;
      case 2:
        if (hasCurMark(sq(rowNum -1, colNum), sq(rowNum - 2, colNum))) return true;
        break;
    }

  }

  hasMark(mark) {
    return function (...args) {
      for (let i = 0; i < args.length; i++) {
        if (args[i].textContent !== mark) return false;
      }
      return true;
    };
  }

  static removeGrid() {
    document.getElementById('grid-container').remove();
  }

}

class Player {
  constructor(mark, isComputer = false, grid) {
    this.mark = mark;
    this.isComputer = isComputer;
    this.background = mark === 'X' ? 'pink' : '#bbffbb';
    if (isComputer) this.grid = grid;
  }

  placeMark(square) {
    square.textContent = this.mark;
    square.classList.remove('unmarked');
    square.classList.add('marked');
    square.style.background = this.background;
  }

  chooseSquare() {
    let square;
    const openSquares = document.getElementsByClassName('unmarked');
    for (let i = 0; i < openSquares.length; i++) {
      if (this.grid.showsWinWith(openSquares[i], this.mark)) square = openSquares[i];
    }
    const otherMark = this.mark === 'X' ? 'O' : 'X';
    for (let i = 0; i < openSquares.length; i++) {
      if (this.grid.showsWinWith(openSquares[i], otherMark)) square = openSquares[i];
    }
    if (square === undefined) {
      const randIdx = Math.floor(Math.random() * openSquares.length);
      square = openSquares[randIdx];
    }
    return square;
  }
}

class Game {
  constructor (numPlayers) {
    this.onClickSquare = this.onClickSquare.bind(this);
    this.onHoverSquare = this.onHoverSquare.bind(this);
    this.grid = new Grid;
    this.addEventsToSquares();
    this.playerX = new Player('X');
    this.playerO = numPlayers === 2 ?
      new Player('O') : new Player('O', true, this.grid);
    this.currentPlayer = this.playerX;
    this.markCount = 0;
  }

  addEventsToSquares() {
    const squares = document.getElementsByClassName('square');
    for (let i = 0; i < squares.length; i++) {
      squares[i].addEventListener('click', this.onClickSquare, false);
      squares[i].addEventListener('mouseenter', this.onHoverSquare, false);
      squares[i].addEventListener('mouseleave', this.onHoverSquare, false);
    }
  }

  onClickSquare (event) {
    const square = event.target;
    if (square.textContent !== '-') return;
    this.takeTurn(square);
  }

  takeTurn(square) {
    this.currentPlayer.placeMark(square);
    this.markCount ++;
    if (this.grid.showsWinWith(square, this.currentPlayer.mark)) {
      this.declareWinner();
      return;
    }
    if (this.isGameOver()) return;
    this.switchPlayers();
  }

  switchPlayers() {
    this.currentPlayer = this.currentPlayer === this.playerX ?
      this.playerO : this.playerX;
    if (this.currentPlayer.isComputer) {
      const square = this.currentPlayer.chooseSquare();
      this.takeTurn(square);
    }
  }

  onHoverSquare (event) {
    let background;
    if (event.target.classList.contains('marked')) {
      return;
    } else if (event.target.style.background !== ''){
      background = '';
    } else {
      background = this.currentPlayer.background;
    }
    event.target.style.background = background;
  }

  declareWinner(winningMark) {
    const winner = document.getElementById('winner');
    const winningText = document.getElementById('winning-text');
    winningText.textContent = `${this.currentPlayer.mark} wins!`;
    toggleDisplay(winner);
  }

  isGameOver() {
    if (this.markCount === 9) {
      toggleDisplay(document.getElementById('gameOver'));
      return true;
    }
    return false;
  }
}

function toggleDisplay(element) {
  element.style.display = window.getComputedStyle(element).display === 'none' ?
    'initial' : 'none';
}

function startGame(numPlayers) {
  toggleDisplay(document.getElementById('start-game'));
  new Game(numPlayers);
}

function replay(event) {
  Grid.removeGrid();
  toggleDisplay(event.target.parentElement);
  toggleDisplay(document.getElementById('start-game'));
}

const onePlayer = document.getElementById('one-player');
const twoPlayer = document.getElementById('two-player');
[onePlayer, twoPlayer].forEach((button, idx) => {
  button.addEventListener('click', () => startGame(idx+1));
});

const replayButtons = document.getElementsByClassName('replay-button');
for (let i = 0; i < replayButtons.length; i++) {
  replayButtons[i].addEventListener('click', replay);
}
