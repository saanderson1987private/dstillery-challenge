const main = document.getElementById('main');

const gridContainer = document.createElement('div');
const grid = document.createElement('div');
const row = document.createElement('div');
const square = document.createElement('div');

const winner = document.createElement('div');
const gameOver = document.createElement('div');

gridContainer.classList.add('grid-container');
grid.classList.add('grid');
row.classList.add('row');
square.classList.add('square');
square.textContent = '-';

winner.id = 'winner';
winner.classList.add('modal');
gameOver.id = 'gameOver';
gameOver.classList.add('modal');
gameOver.innerHTML = `
  <div>GAME OVER</div>
`;
// const replayButton = document.createElement('div');
// replayButton.classList.add('replayButton');
// replayButton.innerHTML = `
//   <div>Replay</div>
// `;

function placeGrid() {
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
  main.appendChild(gridContainer.cloneNode(true));
}
placeGrid();
// winner.appendChild(replayButton.cloneNode(true));
// gameOver.appendChild(replayButton.cloneNode(true));
main.appendChild(winner);
main.appendChild(gameOver);

const squares = document.getElementsByClassName('square');
for (let i = 0; i < squares.length; i++) {
  squares[i].addEventListener('click', placeMark, false);
  squares[i].addEventListener('mouseenter', onHoverSquare, false);
  squares[i].addEventListener('mouseleave', onHoverSquare, false);
}

// const replayButtons = document.getElementsByClassName('replayButton');
// for (let i = 0; i < replayButtons.length; i++) {
//   replayButtons[i].addEventListener('click', restartGame, false);
// }

let mark = 'X';
let markCount = 0;

function placeMark (event) {
  const target = event.target;
  if (target.textContent !== '-') return;
  target.textContent = mark;
  target.classList.add('marked');
  markCount ++;
  if (hasWon(target)) {
    console.log(`${mark} has won!`);
    declareWinner(mark);
  }
  checkEnd();
  mark = mark === 'X' ? 'O' : 'X';
}

function checkEnd() {
  if (markCount === 9) toggleDisplay('gameOver');
}

function isMarked(...args) {
  for (let i = 0; i < args.length; i++) {
    if (args[i].textContent !== mark) return false;
  }
  return true;
}

function el(rowNum, colNum) {
  return document.getElementById(`${rowNum},${colNum}`);
}

function hasWon(targetSq) {
  const rowNum = Number(targetSq.id[0]);
  const colNum = Number(targetSq.id[2]);

  switch (colNum) {
    case 0:
      if (
        isMarked(el(rowNum, colNum + 1), el(rowNum, colNum + 2)) ||
        (rowNum === 0 && isMarked(el(rowNum + 1, colNum + 1), el(rowNum + 2, colNum + 2))) || // diagonal starting w/ 0,0
        (rowNum === 2 && isMarked(el(rowNum - 1, colNum + 1), el(rowNum - 2, colNum + 2))) // diagonal starting w/ 2,0
      ) return true;
      break;
    case 1:
      if (
        isMarked(el(rowNum, colNum - 1), el(rowNum, colNum + 1)) ||
        (rowNum === 1 && isMarked(el(rowNum - 1, colNum - 1), el(rowNum + 1, colNum + 1))) || // diagonal with 1,1 in the middle
        (rowNum === 1 && isMarked(el(rowNum + 1, colNum - 1), el(rowNum - 1, colNum + 1))) // diagonal with 1,1 in the middle
      ) return true;
      break;
    case 2:
      if (
        isMarked(el(rowNum, colNum -1), el(rowNum, colNum - 2)) ||
        (rowNum === 0 && isMarked(el(rowNum + 1, colNum - 1), el(rowNum + 2, colNum - 2))) || // diagonal starting w/ 0,2
        (rowNum === 2 && isMarked(el(rowNum - 1, colNum -1), el(rowNum - 2, colNum - 2))) // diagonal starting w/ 2,2
      ) return true;
      break;
  }

  switch (rowNum) {
    case 0:
      if (isMarked(el(rowNum + 1, colNum), el(rowNum + 2, colNum))) return true;
      break;
    case 1:
      if (isMarked(el(rowNum - 1, colNum), el(rowNum + 1, colNum))) return true;
      break;
    case 2:
      if (isMarked(el(rowNum -1, colNum), el(rowNum - 2, colNum))) return true;
      break;
  }

}

function declareWinner(winningMark) {
  const element = document.getElementById('winner');
  const winningText = document.createElement('div');
  winningText.textContent = `${winningMark} wins!`;
  element.insertBefore(winningText, element.childNodes[0]);
  toggleDisplay(element);
}

function toggleDisplay(element) {
  element.style.display = window.getComputedStyle(element).display === 'none' ?
    'initial' : 'none';
}

function onHoverSquare (event) {
  let background;
  if (event.target.classList.contains('marked')) {
    return;
  } else if (event.target.style.background !== ''){
    background = '';
  } else {
    background = mark === 'X' ? 'pink' : '#bbffbb';
  }
  event.target.style.background = background;
}

function isThereGrid() {
}

// function restartGame() {
//   toggleDisplay(document.getElementsByClassName('modal')[0]);
//   debugger;
//   document.getElementsByClassName('grid-container')[0].remove();
//   placeGrid();
// }
