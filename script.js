// Game state
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// DOM elements
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const playerDisplay = document.getElementById('player');
const resetButton = document.getElementById('reset-btn');

// Messages
const winMessage = () => `Player ${currentPlayer} wins!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `Current Player: ${currentPlayer}`;

// Initialize game
statusDisplay.innerHTML = currentPlayerTurn();
playerDisplay.textContent = currentPlayer;

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    // Check if cell is already played or game is inactive
    if (gameBoard[cellIndex] !== '' || !gameActive) {
        return;
    }

    // Update game state
    gameBoard[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    // Check for win or draw
    if (checkWin()) {
        statusDisplay.innerHTML = winMessage();
        statusDisplay.className = 'status win';
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        statusDisplay.innerHTML = drawMessage();
        statusDisplay.className = 'status draw';
        gameActive = false;
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerDisplay.textContent = currentPlayer;
    statusDisplay.innerHTML = currentPlayerTurn();

    // If it's AI's turn, make AI move after a short delay
    if (gameActive && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
}

// Check for win
function checkWin() {
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

// Check for draw
function checkDraw() {
    return !gameBoard.includes('');
}

// Make AI move
function makeAIMove() {
    if (!gameActive) return;

    // Simple AI logic:
    // 1. Try to win if possible
    // 2. Block player from winning
    // 3. Take center if available
    // 4. Take a corner
    // 5. Take any available spot
    
    let moveIndex = -1;

    // Try to win
    for (let i = 0; i < winPatterns.length; i++) {
        const [a, b, c] = winPatterns[i];
        if (gameBoard[a] === 'O' && gameBoard[b] === 'O' && gameBoard[c] === '') {
            moveIndex = c;
            break;
        }
        if (gameBoard[a] === 'O' && gameBoard[c] === 'O' && gameBoard[b] === '') {
            moveIndex = b;
            break;
        }
        if (gameBoard[b] === 'O' && gameBoard[c] === 'O' && gameBoard[a] === '') {
            moveIndex = a;
            break;
        }
    }

    // Block player from winning
    if (moveIndex === -1) {
        for (let i = 0; i < winPatterns.length; i++) {
            const [a, b, c] = winPatterns[i];
            if (gameBoard[a] === 'X' && gameBoard[b] === 'X' && gameBoard[c] === '') {
                moveIndex = c;
                break;
            }
            if (gameBoard[a] === 'X' && gameBoard[c] === 'X' && gameBoard[b] === '') {
                moveIndex = b;
                break;
            }
            if (gameBoard[b] === 'X' && gameBoard[c] === 'X' && gameBoard[a] === '') {
                moveIndex = a;
                break;
            }
        }
    }

    // Take center if available
    if (moveIndex === -1 && gameBoard[4] === '') {
        moveIndex = 4;
    }

    // Take a corner
    if (moveIndex === -1) {
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(index => gameBoard[index] === '');
        if (availableCorners.length > 0) {
            moveIndex = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
    }

    // Take any available spot
    if (moveIndex === -1) {
        const availableSpots = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        if (availableSpots.length > 0) {
            moveIndex = availableSpots[Math.floor(Math.random() * availableSpots.length)];
        }
    }

    // If we found a move, make it
    if (moveIndex !== -1) {
        gameBoard[moveIndex] = 'O';
        cells[moveIndex].textContent = 'O';
        cells[moveIndex].classList.add('o');
        
        // Check for win or draw
        if (checkWin()) {
            statusDisplay.innerHTML = winMessage();
            statusDisplay.className = 'status win';
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            statusDisplay.innerHTML = drawMessage();
            statusDisplay.className = 'status draw';
            gameActive = false;
            return;
        }

        // Switch back to player
        currentPlayer = 'X';
        playerDisplay.textContent = currentPlayer;
        statusDisplay.innerHTML = currentPlayerTurn();
    }
}

// Reset game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    statusDisplay.innerHTML = currentPlayerTurn();
    statusDisplay.className = 'status';
    playerDisplay.textContent = currentPlayer;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);