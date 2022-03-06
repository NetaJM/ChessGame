'use strict'

const KING_WHITE = '♔';
const QUEEN_WHITE = '♕';
const ROOK_WHITE = '♖';
const BISHOP_WHITE = '♗';
const KNIGHT_WHITE = '♘';
const PAWN_WHITE = '♙';
const KING_BLACK = '♚';
const QUEEN_BLACK = '♛';
const ROOK_BLACK = '♜';
const BISHOP_BLACK = '♝';
const KNIGHT_BLACK = '♞';
const PAWN_BLACK = '♟';

// The Chess Board
let gBoard;
let gSelectedElementCell = null;

function restartGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    // board 8 * 8
    let board = [];
    for (let i = 0; i < 8; i++) {
        board[i] = [];
        for (let j = 0; j < 8; j++) {
            let piece = ''
            if (i === 1) piece = PAWN_BLACK;
            if (i === 6) piece = PAWN_WHITE;
            board[i][j] = piece;
        }
    }

    board[0][0] = board[0][7] = ROOK_BLACK;
    board[0][1] = board[0][6] = KNIGHT_BLACK;
    board[0][2] = board[0][5] = BISHOP_BLACK;
    board[0][3] = QUEEN_BLACK;
    board[0][4] = KING_BLACK;

    board[7][0] = board[7][7] = ROOK_WHITE;
    board[7][1] = board[7][6] = KNIGHT_WHITE;
    board[7][2] = board[7][5] = BISHOP_WHITE;
    board[7][3] = QUEEN_WHITE;
    board[7][4] = KING_WHITE;

    console.table(board);
    return board;

}

function renderBoard(board) {
    let strHtml = '';
    for (let i = 0; i < board.length; i++) {
        let row = board[i];
        strHtml += '<tr>';
        for (let j = 0; j < row.length; j++) {
            let cell = row[j];
            // figures class name
            let className = ((i + j) % 2 === 0) ? 'white' : 'black';
            let tdId = `cell-${i}-${j}`;

            strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this)">
                            ${cell}
                        </td>`
        }
        strHtml += '</tr>';
    }
    let elementMat = document.querySelector('.game-board');
    elementMat.innerHTML = strHtml;
}


function cellClicked(elementCell) {

    // moving the piece if its target is marked 
    if (elementCell.classList.contains('mark')) {
        movePiece(gSelectedElementCell, elementCell);
        cleanBoard();
        return;
    }

    cleanBoard();

    elementCell.classList.add('selected');
    gSelectedElementCell = elementCell;


    let cellCoord = getCellCoord(elementCell.id);
    let piece = gBoard[cellCoord.i][cellCoord.j];


    let possibleCoords = [];
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord);
            break;
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord);
            break;
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE);
            break;
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord)
        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord)

    }
    markCells(possibleCoords);
}

function movePiece(elementFromCell, elementToCell) {

    let fromCoord = getCellCoord(elementFromCell.id);
    let toCoord = getCellCoord(elementToCell.id);

    // updating the MODEL
    let piece = gBoard[fromCoord.i][fromCoord.j];
    gBoard[fromCoord.i][fromCoord.j] = '';
    gBoard[toCoord.i][toCoord.j] = piece;
    // updating the DOM
    elementFromCell.innerText = '';
    elementToCell.innerText = piece;
}


function markCells(coords) {
    for (let i = 0; i < coords.length; i++) {
        let coord = coords[i];
        let elementCell = document.querySelector(`#cell-${coord.i}-${coord.j}`);
        elementCell.classList.add('mark')
    }
}


function getCellCoord(strCellId) {
    let parts = strCellId.split('-')
    let coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

function cleanBoard() {
    let elementTds = document.querySelectorAll('.mark, .selected');
    for (let i = 0; i < elementTds.length; i++) {
        elementTds[i].classList.remove('mark', 'selected');
    }
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}

function isValidCell(coord) {
    if (gBoard[coord.i]) {
        if (gBoard[coord.i][coord.j] !== undefined) {
            return true;
        }
    }
    return false;
}

// Pawn coords
function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    let res = [];

    let diff = (isWhite) ? -1 : 1;
    let nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
    if (isEmptyCell(nextCoord)) res.push(nextCoord);
    else return res;

    if ((pieceCoord.i === 1 && !isWhite) || (pieceCoord.i === 6 && isWhite)) {
        diff *= 2;
        nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
        if (isEmptyCell(nextCoord)) res.push(nextCoord);
    }
    return res;
}


// Rook coords
function getAllPossibleCoordsRook(pieceCoord) {
    let res = [];

    let canGoLeft = true;
    let canGoRight = true;
    let canGoUp = true;
    let canGoDown = true;
    let diff = 1;
    while (canGoLeft || canGoRight || canGoUp || canGoDown) {
        let leftCell = { i: pieceCoord.i, j: pieceCoord.j - diff };
        let rightCell = { i: pieceCoord.i, j: pieceCoord.j + diff };
        let upCell = { i: pieceCoord.i - diff, j: pieceCoord.j };
        let downCell = { i: pieceCoord.i + diff, j: pieceCoord.j };
        if (isValidCell(leftCell) && isEmptyCell(leftCell) && canGoLeft) {
            res.push(leftCell);
        } else {
            canGoLeft = false;
        }
        if (isValidCell(rightCell) && isEmptyCell(rightCell) && canGoRight) {
            res.push(rightCell);
        } else {
            canGoRight = false;
        }
        if (isValidCell(upCell) && isEmptyCell(upCell) && canGoUp) {
            res.push(upCell);
        } else {
            canGoUp = false;
        }
        if (isValidCell(downCell) && isEmptyCell(downCell) && canGoDown) {
            res.push(downCell);
        } else {
            canGoDown = false;
        }
        diff++;
    }
    return res;
}

// Bishop coords 
function getAllPossibleCoordsBishop(pieceCoord) {
    let res = [];

    let canGoDownLeft = true;
    let canGoDownRight = true;
    let canGoUpLeft = true;
    let canGoUpRight = true;
    let diff = 1;
    while (canGoDownLeft || canGoDownRight || canGoUpLeft || canGoUpRight) {
        let downLeftCell = { i: pieceCoord.i + diff, j: pieceCoord.j - diff };
        let downRightCell = { i: pieceCoord.i + diff, j: pieceCoord.j + diff };
        let upLeftCell = { i: pieceCoord.i - diff, j: pieceCoord.j - diff };
        let upRightCell = { i: pieceCoord.i - diff, j: pieceCoord.j + diff };
        if (isValidCell(downLeftCell) && isEmptyCell(downLeftCell) && canGoDownLeft) {
            res.push(downLeftCell);
        } else {
            canGoDownLeft = false;
        }
        if (isValidCell(downRightCell) && isEmptyCell(downRightCell) && canGoDownRight) {
            res.push(downRightCell);
        } else {
            canGoDownRight = false;
        }
        if (isValidCell(upLeftCell) && isEmptyCell(upLeftCell) && canGoUpLeft) {
            res.push(upLeftCell);
        } else {
            canGoUpLeft = false;
        }
        if (isValidCell(upRightCell) && isEmptyCell(upRightCell) && canGoUpRight) {
            res.push(upRightCell);
        } else {
            canGoUpRight = false;
        }
        diff++;
    }
    return res;
}

// Queen coords 
function getAllPossibleCoordsQueen(pieceCoord) {

    let diagonalMoves = getAllPossibleCoordsBishop(pieceCoord)
    let perpendicularMoves = getAllPossibleCoordsRook(pieceCoord);
    let totalMoves = [...diagonalMoves, ...perpendicularMoves];
    return totalMoves;
}

// King coords 
function getAllPossibleCoordsKing(pieceCoord) {
    let res = [];

    let moves = [
        { i: pieceCoord.i, j: pieceCoord.j - 1 },
        { i: pieceCoord.i, j: pieceCoord.j + 1 },
        { i: pieceCoord.i - 1, j: pieceCoord.j },
        { i: pieceCoord.i + 1, j: pieceCoord.j },
        { i: pieceCoord.i + 1, j: pieceCoord.j - 1 },
        { i: pieceCoord.i + 1, j: pieceCoord.j + 1 },
        { i: pieceCoord.i - 1, j: pieceCoord.j - 1 },
        { i: pieceCoord.i - 1, j: pieceCoord.j + 1 }
    ]
    for (let i = 0; i < moves.length; i++) {
        let cell = moves[i]
        if (isValidCell(cell) && isEmptyCell(cell)) {
            res.push(cell)
        }
    }
    return res;
}

// Knight coords 
function getAllPossibleCoordsKnight(pieceCoord) {
    let res = [];

    return res;
}
