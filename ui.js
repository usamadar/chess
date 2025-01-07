/**
 * @fileoverview UI event handlers and display logic for the chess game
 */

function handleMove(piece, fromRow, fromCol, toRow, toCol, targetPiece) {
    const pieceType = piece.toLowerCase();
    const color = piece === piece.toUpperCase() ? 'white' : 'black';
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Handle captures
    if (targetPiece !== '') {
        addCapturedPiece(targetPiece, color);
    }

    // Handle en passant
    if (pieceType === 'p' && colDiff === 1 && rowDiff === 1 && targetPiece === '') {
        const capturedRow = fromRow;
        const capturedCol = toCol;
        const capturedPiece = initialBoard[capturedRow][capturedCol];
        initialBoard[capturedRow][capturedCol] = '';
        document.querySelector(`[data-row="${capturedRow}"][data-col="${capturedCol}"]`).textContent = '';
        addCapturedPiece(capturedPiece, color);
    }

    // Handle castling
    if (pieceType === 'k' && (colDiff === 2 || colDiff === 3)) {
        const rookFromCol = toCol > fromCol ? 7 : 0;
        const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
        
        initialBoard[toRow][rookToCol] = initialBoard[toRow][rookFromCol];
        initialBoard[toRow][rookFromCol] = '';
        
        const rookSquare = document.querySelector(
            `[data-row="${toRow}"][data-col="${rookFromCol}"]`
        );
        const newRookSquare = document.querySelector(
            `[data-row="${toRow}"][data-col="${rookToCol}"]`
        );
        newRookSquare.textContent = rookSquare.textContent;
        rookSquare.textContent = '';
        
        gameState.castlingRights[color].kingSide = false;
        gameState.castlingRights[color].queenSide = false;
    }

    // Move the piece
    const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
    toSquare.textContent = fromSquare.textContent;
    initialBoard[toRow][toCol] = initialBoard[fromRow][fromCol];
    initialBoard[fromRow][fromCol] = '';
    fromSquare.textContent = '';

    updateCastlingRights(piece, color, fromCol);
    
    document.querySelectorAll('.castling-available').forEach(square => {
        square.classList.remove('castling-available');
    });
    
    updateEnPassantTarget(piece, fromRow, fromCol, toRow);
    
    if (pieceType === 'p' && (toRow === 0 || toRow === 7)) {
        const newPiece = piece === 'P' ? 'Q' : 'q';
        initialBoard[toRow][toCol] = newPiece;
        toSquare.textContent = getPieceSymbol(newPiece);
    }
    
    const isCapture = targetPiece !== '';
    const moveNotation = getAlgebraicNotation(piece, fromRow, fromCol, toRow, toCol, isCapture);
    addMoveToHistory(moveNotation);

    switchTurn();

    if (isCheckmate(gameState.currentTurn)) {
        endGame(`${gameState.currentTurn === 'white' ? 'Black' : 'White'} wins by checkmate!`);
        return;
    }
    if (isStalemate(gameState.currentTurn)) {
        endGame('Stalemate!');
        return;
    }
}

function handleSquareClick(event) {
    const square = event.currentTarget;
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const piece = initialBoard[row][col];
    
    if (piece && piece.toLowerCase() === 'k') {
        const color = piece === 'K' ? 'white' : 'black';
        if (gameState.castlingRights[color].kingSide) {
            const kingSideRookCol = color === 'white' ? 7 : 0;
            const kingSideSquare = document.querySelector(
                `[data-row="${row}"][data-col="${kingSideRookCol}"]`
            );
            if (kingSideSquare) {
                kingSideSquare.classList.add('castling-available');
            }
        }
        if (gameState.castlingRights[color].queenSide) {
            const queenSideRookCol = color === 'white' ? 0 : 7;
            const queenSideSquare = document.querySelector(
                `[data-row="${row}"][data-col="${queenSideRookCol}"]`
            );
            if (queenSideSquare) {
                queenSideSquare.classList.add('castling-available');
            }
        }
    }
    
    if (selectedSquare) {
        if (square !== selectedSquare) {
            const fromRow = parseInt(selectedSquare.dataset.row);
            const fromCol = parseInt(selectedSquare.dataset.col);
            const piece = initialBoard[fromRow][fromCol];
            const targetPiece = initialBoard[row][col];
            
            if (isValidMove(piece, fromRow, fromCol, row, col)) {
                handleMove(piece, fromRow, fromCol, row, col, targetPiece);
            } else {
                console.log('Invalid move');
            }
        }
        
        selectedSquare.classList.remove('highlight');
        selectedSquare = null;
    } else if (piece) {
        const pieceColor = piece === piece.toUpperCase() ? 'white' : 'black';
        if (pieceColor === gameState.currentTurn) {
            selectedSquare = square;
            square.classList.add('highlight');
            console.log(`Selected ${pieceColor} piece at [${row},${col}]`);
        } else {
            console.log(`Not your turn! It's ${gameState.currentTurn}'s turn`);
        }
    }
}

function endGame(result) {
    const message = document.createElement('div');
    message.classList.add('game-over');
    message.textContent = `Game Over: ${result}`;
    
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Play Again';
    restartButton.addEventListener('click', () => {
        boardElement.removeChild(message);
        gameState.currentTurn = 'white';
        Object.assign(initialBoard, JSON.parse(JSON.stringify(initialBoard)));
        createBoard();
    });
    
    message.appendChild(restartButton);
    boardElement.appendChild(message);
} 