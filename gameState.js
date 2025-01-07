/**
 * @fileoverview Game state management for the chess game
 */

const gameState = {
    castlingRights: {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true }
    },
    enPassantTarget: null,
    lastMove: null,
    moveHistory: [],
    kingHasMoved: {
        white: false,
        black: false
    },
    rookHasMoved: {
        white: { kingSide: false, queenSide: false },
        black: { kingSide: false, queenSide: false }
    },
    currentTurn: 'white',
    capturedPieces: {
        white: [], // pieces captured by white
        black: []  // pieces captured by black
    }
};

function updateCastlingRights(piece, color, fromCol) {
    if (piece.toLowerCase() === 'k') {
        gameState.castlingRights[color].kingSide = false;
        gameState.castlingRights[color].queenSide = false;
        gameState.kingHasMoved[color] = true;
    }
    if (piece.toLowerCase() === 'r') {
        if (fromCol === 0) {
            gameState.castlingRights[color].queenSide = false;
            gameState.rookHasMoved[color].queenSide = true;
        }
        if (fromCol === 7) {
            gameState.castlingRights[color].kingSide = false;
            gameState.rookHasMoved[color].kingSide = true;
        }
    }
}

function updateEnPassantTarget(piece, fromRow, fromCol, toRow) {
    if (piece.toLowerCase() === 'p' && Math.abs(toRow - fromRow) === 2) {
        const enPassantRow = fromRow + (toRow - fromRow) / 2;
        gameState.enPassantTarget = { row: enPassantRow, col: fromCol };
    } else {
        gameState.enPassantTarget = null;
    }
}

function addCapturedPiece(piece, capturedBy) {
    gameState.capturedPieces[capturedBy].push(piece);
    updateCapturedPiecesDisplay();
}

function switchTurn() {
    gameState.currentTurn = gameState.currentTurn === 'white' ? 'black' : 'white';
    updateTurnIndicator(gameState.currentTurn);
    console.log(`Turn switched to ${gameState.currentTurn}`);
}

function resetGameState() {
    gameState.castlingRights = {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true }
    };
    gameState.enPassantTarget = null;
    gameState.lastMove = null;
    gameState.moveHistory = [];
    gameState.kingHasMoved = {
        white: false,
        black: false
    };
    gameState.rookHasMoved = {
        white: { kingSide: false, queenSide: false },
        black: { kingSide: false, queenSide: false }
    };
    gameState.currentTurn = 'white';
    gameState.capturedPieces = {
        white: [],
        black: []
    };
    updateTurnIndicator('white');
    updateCapturedPiecesDisplay();
} 