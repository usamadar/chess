/**
 * @fileoverview Move validation and piece movement rules for the chess game
 */

function isSquareAttacked(row, col, color, board = initialBoard) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && (piece === piece.toUpperCase()) !== (color === 'white')) {
                if (isValidMove(piece, i, j, row, col, true)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function findKingPosition(color, board = initialBoard) {
    const king = color === 'white' ? 'K' : 'k';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === king) {
                return { row, col };
            }
        }
    }
    return null;
}

function hasLegalMoves(color) {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = initialBoard[fromRow][fromCol];
            if (piece && (piece === piece.toUpperCase()) === (color === 'white')) {
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (isValidMove(piece, fromRow, fromCol, toRow, toCol, true)) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

function isInCheck(color) {
    const kingPos = findKingPosition(color);
    if (!kingPos) return false;
    return isSquareAttacked(kingPos.row, kingPos.col, color);
}

function isStalemate(color) {
    if (isInCheck(color)) return false;
    return !hasLegalMoves(color);
}

function isCheckmate(color) {
    if (!isInCheck(color)) return false;
    return !hasLegalMoves(color);
}

function isPathBlocked(fromRow, fromCol, toRow, toCol) {
    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
        if (initialBoard[currentRow][currentCol] !== '') {
            return true;
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    return false;
}

function isValidMove(piece, fromRow, fromCol, toRow, toCol, skipCheckCheck = false) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    const pieceType = piece.toLowerCase();
    const targetPiece = initialBoard[toRow][toCol];
    const color = piece === piece.toUpperCase() ? 'white' : 'black';
    
    // Can't capture own pieces
    if (targetPiece !== '' && 
        (piece === piece.toUpperCase()) === (targetPiece === targetPiece.toUpperCase())) {
        return false;
    }

    // Check if move would leave king in check
    if (!skipCheckCheck) {
        const tempBoard = JSON.parse(JSON.stringify(initialBoard));
        tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
        tempBoard[fromRow][fromCol] = '';
        
        const kingPos = findKingPosition(color, tempBoard);
        if (kingPos && isSquareAttacked(kingPos.row, kingPos.col, color, tempBoard)) {
            return false;
        }
    }

    // Castling check
    if (pieceType === 'k' && rowDiff === 0 && colDiff === 2) {
        if (toCol === 6) {
            return gameState.castlingRights[color].kingSide &&
                   initialBoard[fromRow][5] === '' &&
                   initialBoard[fromRow][6] === '' &&
                   !isSquareAttacked(fromRow, fromCol, color) &&
                   !isSquareAttacked(fromRow, 5, color) &&
                   !isSquareAttacked(fromRow, 6, color) &&
                   !gameState.kingHasMoved[color] &&
                   !gameState.rookHasMoved[color].kingSide;
        }
        if (toCol === 2) {
            return gameState.castlingRights[color].queenSide &&
                   initialBoard[fromRow][3] === '' &&
                   initialBoard[fromRow][2] === '' &&
                   initialBoard[fromRow][1] === '' &&
                   !isSquareAttacked(fromRow, fromCol, color) &&
                   !isSquareAttacked(fromRow, 3, color) &&
                   !isSquareAttacked(fromRow, 2, color) &&
                   !gameState.kingHasMoved[color] &&
                   !gameState.rookHasMoved[color].queenSide;
        }
    }

    switch (pieceType) {
        case 'p': // Pawn
            const direction = piece === 'P' ? -1 : 1;
            if (colDiff === 1 && rowDiff === 1) {
                return targetPiece !== '';
            }
            if (colDiff === 0) {
                if (rowDiff === 1) {
                    return targetPiece === '';
                }
                if (rowDiff === 2 && 
                    ((piece === 'P' && fromRow === 6) || 
                     (piece === 'p' && fromRow === 1))) {
                    return targetPiece === '' && 
                           initialBoard[fromRow + direction][fromCol] === '';
                }
            }
            return false;
            
        case 'r': // Rook
            return (rowDiff === 0 || colDiff === 0) && !isPathBlocked(fromRow, fromCol, toRow, toCol);
            
        case 'n': // Knight
            return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
            
        case 'b': // Bishop
            return rowDiff === colDiff && !isPathBlocked(fromRow, fromCol, toRow, toCol);
            
        case 'q': // Queen
            return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) && 
                   !isPathBlocked(fromRow, fromCol, toRow, toCol);
            
        case 'k': // King
            if (rowDiff <= 1 && colDiff <= 1) {
                return true;
            }
            return false;
            
        default:
            return false;
    }
} 