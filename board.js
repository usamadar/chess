/**
 * @fileoverview Board creation and rendering functionality for the chess game
 */

const boardElement = document.getElementById('chessboard');
let selectedSquare = null;

// Create game container
const gameContainer = document.createElement('div');
gameContainer.classList.add('game-container');
boardElement.parentNode.insertBefore(gameContainer, boardElement);

// Create board container
const boardContainer = document.createElement('div');
boardContainer.classList.add('board-container');

// Create turn indicator
const turnIndicator = document.createElement('div');
turnIndicator.id = 'turn-indicator';
updateTurnIndicator(gameState.currentTurn);
boardContainer.appendChild(turnIndicator);

// Create captured pieces displays
const whiteCapturedPieces = document.createElement('div');
whiteCapturedPieces.classList.add('captured-pieces');
const whiteCapturedHeader = document.createElement('div');
whiteCapturedHeader.classList.add('captured-pieces-header');
whiteCapturedHeader.textContent = 'Captured by White';
const whiteCapturedContent = document.createElement('div');
whiteCapturedContent.classList.add('captured-pieces-content');
whiteCapturedPieces.appendChild(whiteCapturedHeader);
whiteCapturedPieces.appendChild(whiteCapturedContent);

const blackCapturedPieces = document.createElement('div');
blackCapturedPieces.classList.add('captured-pieces');
const blackCapturedHeader = document.createElement('div');
blackCapturedHeader.classList.add('captured-pieces-header');
blackCapturedHeader.textContent = 'Captured by Black';
const blackCapturedContent = document.createElement('div');
blackCapturedContent.classList.add('captured-pieces-content');
blackCapturedPieces.appendChild(blackCapturedHeader);
blackCapturedPieces.appendChild(blackCapturedContent);

// Add all elements to the containers
boardContainer.appendChild(boardElement);
gameContainer.appendChild(whiteCapturedPieces);
gameContainer.appendChild(boardContainer);
gameContainer.appendChild(blackCapturedPieces);

function updateTurnIndicator(color) {
    turnIndicator.className = color === 'white' ? 'white-turn' : 'black-turn';
    const piece = color === 'white' ? pieces.white.king : pieces.black.king;
    turnIndicator.innerHTML = `
        <span id="turn-indicator-piece">${piece}</span>
        <span>${color === 'white' ? 'White' : 'Black'}'s Turn</span>
    `;
}

function updateCapturedPiecesDisplay() {
    // Update white's captures
    whiteCapturedContent.innerHTML = '';
    gameState.capturedPieces.white.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('captured-piece');
        pieceElement.textContent = getPieceSymbol(piece);
        whiteCapturedContent.appendChild(pieceElement);
    });

    // Update black's captures
    blackCapturedContent.innerHTML = '';
    gameState.capturedPieces.black.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('captured-piece');
        pieceElement.textContent = getPieceSymbol(piece);
        blackCapturedContent.appendChild(pieceElement);
    });
}

function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            
            const piece = initialBoard[row][col];
            if (piece) {
                square.textContent = getPieceSymbol(piece);
            }
            
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', handleSquareClick);
            boardElement.appendChild(square);
        }
    }
}

// Initialize the board when the page loads
document.addEventListener('DOMContentLoaded', createBoard);

// Export for use in other files
window.updateTurnIndicator = updateTurnIndicator;
window.updateCapturedPiecesDisplay = updateCapturedPiecesDisplay; 