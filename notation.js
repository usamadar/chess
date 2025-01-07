/**
 * @fileoverview Chess notation and move history functionality
 */

// Create move history container
const moveHistoryElement = document.createElement('div');
moveHistoryElement.id = 'move-history';

// Add header
const historyHeader = document.createElement('div');
historyHeader.id = 'move-history-header';
historyHeader.textContent = 'Move History';
moveHistoryElement.appendChild(historyHeader);

// Add content container
const historyContent = document.createElement('div');
historyContent.id = 'move-history-content';
moveHistoryElement.appendChild(historyContent);

document.body.appendChild(moveHistoryElement);

function addMoveToHistory(move) {
    gameState.moveHistory.push(move);
    const moveIndex = gameState.moveHistory.length - 1;
    const moveNumber = Math.ceil((moveIndex + 1) / 2);
    
    // Create or get the current move row
    let moveRow;
    if (moveIndex % 2 === 0) {
        // White's move - create new row
        moveRow = document.createElement('div');
        moveRow.classList.add('move-row');
        
        const numberSpan = document.createElement('span');
        numberSpan.classList.add('move-number');
        numberSpan.textContent = `${moveNumber}.`;
        moveRow.appendChild(numberSpan);
        
        const whiteMove = document.createElement('span');
        whiteMove.classList.add('move', 'white-move');
        whiteMove.textContent = move;
        moveRow.appendChild(whiteMove);
        
        // Add empty black move placeholder
        const blackMove = document.createElement('span');
        blackMove.classList.add('move');
        moveRow.appendChild(blackMove);
        
        historyContent.appendChild(moveRow);
    } else {
        // Black's move - update last row
        moveRow = historyContent.lastElementChild;
        const blackMove = moveRow.lastElementChild;
        blackMove.classList.add('black-move');
        blackMove.textContent = move;
    }
    
    // Scroll to bottom
    moveHistoryElement.scrollTop = moveHistoryElement.scrollHeight;
}

function getAlgebraicNotation(piece, fromRow, fromCol, toRow, toCol, isCapture) {
    const pieceType = piece.toLowerCase();
    const file = String.fromCharCode(97 + fromCol);
    const rank = 8 - fromRow;
    const destFile = String.fromCharCode(97 + toCol);
    const destRank = 8 - toRow;
    const color = piece === piece.toUpperCase() ? 'white' : 'black';
    
    let notation = '';
    
    // Handle castling
    if (pieceType === 'k' && Math.abs(toCol - fromCol) === 2) {
        return toCol > fromCol ? 'O-O' : 'O-O-O';
    }
    
    // Add piece symbol (except for pawns)
    if (pieceType !== 'p') {
        notation += piece === piece.toUpperCase() ? 
            pieces.white[getPieceName(pieceType)] : 
            pieces.black[getPieceName(pieceType)];
    }
    
    // Add capture indicator
    if (isCapture) {
        if (pieceType === 'p') {
            notation += file;
        }
        notation += 'x';
    }
    
    notation += `${destFile}${destRank}`;
    
    if (pieceType === 'p' && (toRow === 0 || toRow === 7)) {
        notation += '=Q';
    }
    
    const opponentColor = color === 'white' ? 'black' : 'white';
    if (isCheckmate(opponentColor)) {
        notation += '#';
    } else if (isInCheck(opponentColor)) {
        notation += '+';
    }
    
    return notation;
} 