// A game of 3x3
const n = 3;
const winCondition = 3;
//const selectBox = document.querySelector(".select-box"),
//selectBtnX = selectBox.querySelector(".options .playerX"),
//selectBtnO = selectBox.querySelector(".options .playerO");
//playBoard = document.querySelector(".game-conatiner");
// Init a 2D array that manage the board, default value 0
const gameBoard = Array.from({length: n}, () =>
    Array.from({length: n}, () => 0)
);
// current player and AI status
let PL = 1;
let AI = false;

function restart() {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = '';
        cells[i].addEventListener('click', cellClick, false);
    }
    //player = 1;
    gameBoard.forEach(arr => arr.fill(0));
    console.log(gameBoard)
}

function cellClick(cell) {
    play(cell.target.id);
    if (AI) {
        // do sth to get the id
        const aiResult = minmax(gameBoard, 0, PL);
        console.log(aiResult);
        const cellId = `c${aiResult.row}${aiResult.col}`;
        play(cellId);
    }
}

function play(cellId) {
    const cell = document.getElementById(cellId);
    if (cell.textContent === '') {
        const pattern = PL === 1 ? 'O' : 'X';
        console.log(`play ${pattern} on ${cellId}`);
        cell.textContent = pattern;
        const row = parseInt(cellId.charAt(1));
        const col = parseInt(cellId.charAt(2));
        writeBoard(row, col);
        checkBoard(row, col);
        switchTurn();
    }

}

function writeBoard(row, col) {
    console.log(`${row}:${col}`);
    gameBoard[row][col] = PL;
}

function switchTurn() {
    if (PL === 1) {
        PL = -1;
    } else {
        PL = 1;
    }
}

function checkBoard(row, col) {
    let winner = null;
    //check win
    const state = gameState(gameBoard, PL, row, col);
    if (state) {
        winner = PL === 1 ? 'O' : 'X';
        endGame(winner);
    } else if (state === null) {
        console.log(`TIE`);
        endGame(null);
    }
}

function gameState(board, PL, row, col) {
    let diag1 = 0;
    let diag2 = 0;
    // check all board if not pass in last turn play
    if (row === undefined && col === undefined) {
        for (let i = 0; i < n; i++) {
            let ver = 0;
            let hor = 0;
            for (let j = 0; j < n; j++) {
                ver += board[j][i];
                hor += board[i][j];
            }
            if (ver === PL * winCondition || hor === PL * winCondition) {
                return true;
            }
        }
        for (let i = 0; i < n; i++) {
            //check diagonal
            diag1 += board[i][i];
            diag2 += board[i][n - 1 - i];
        }
        if (diag1 === PL * winCondition || diag2 === PL * winCondition) {
            return true;
        } else if (board.every(arr => arr.every(n => n !== 0))) {
            return null;
        } else {
            return false;
        }
    } else {
        // check vertical
        //check horizontal
        let ver = 0;
        let hor = 0;
        for (let i = 0; i < n; i++) {
            ver += board[i][col];
            hor += board[row][i];
            //check diagonal
            diag1 += board[i][i];
            diag2 += board[i][n - 1 - i];
        }
        if (ver === PL * winCondition || hor === PL * winCondition || diag1 === PL * winCondition || diag2 === PL * winCondition) {
            return true;
        } else if (board.every(arr => arr.every(n => n !== 0))) {
            return null;
        } else {
            return false;
        }
    }
}

function endGame(winner) {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', cellClick);
    }
    if (winner !== null) {
        setTimeout(() => { alert(`Congratulations! ${winner} WINNNN :D`);}, 500);

    } else {
        setTimeout(() =>  alert(`It's a tie`), 500);
    }
}

function minmax(board, depth, PL) {
    // check state of last move by last player, so we have to flip player
    const state = gameState(board, PL== 1 ? -1 : 1);
    if (state) {
        // game win go here
        // if this turn player is -1 (AI), then last turn is 1 (Human)
        return PL === -1 ? depth - 10 : 10 - depth;
    } else if (state === null) {
        return 0;
    } else {
        let moves = [];
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // clone the board
                const calcBoard = board.map(arr => Array.from(arr));
                if (calcBoard[i][j] === 0) {
                    calcBoard[i][j] = PL;
                    const value = minmax(calcBoard, depth + 1, PL === 1 ? -1 : 1);
                    moves.push({
                        cost: value,
                        cell: {
                            row: i,
                            col: j
                        }
                    });
                }
            }
        }
        if (PL === -1) {
            const max = moves.reduce((a, b) => a.cost > b.cost ? a : b);
            if (depth === 0) {
                return max.cell;
            } else {
                return max.cost;
            }
        } else {
            const min = moves.reduce((a, b) => a.cost < b.cost ? a : b);
            if (depth === 0) {
                return min.cell;
            } else {
                return min.cost;
            }
        }
    }
}

// start game
restart();
