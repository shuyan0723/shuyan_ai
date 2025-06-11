const grid = document.querySelector('.grid-container');
const scoreContainer = document.querySelector('.score-container');
const cells = document.querySelectorAll('.grid-cell');
const gridSize = 4;
let board = [];
let score = 0;

function initializeBoard() {
    board = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    cells.forEach((cell, index) => {
        cell.textContent = '';
        cell.classList.remove('number-2', 'number-4', 'number-8', 'number-16', 'number-32', 'number-64', 'number-128', 'number-256', 'number-512', 'number-1024', 'number-2048');
    });
    addRandomTile();
    addRandomTile();
}

function addRandomTile() {
    const availableCells = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (!board[i][j]) {
                availableCells.push({ row: i, col: j });
            }
        }
    }
    if (availableCells.length === 0) return;
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    board[randomCell.row][randomCell.col] = value;
    const cell = document.getElementById(`grid-cell-${randomCell.row}-${randomCell.col}`);
    cell.textContent = value;
    cell.classList.add(`number-${value}`);
}

function moveTiles(direction) {
    let moved = false;
    switch (direction) {
        case 'up':
            for (let col = 0; col < gridSize; col++) {
                for (let row = 1; row < gridSize; row++) {
                    if (board[row][col]) {
                        let newRow = row;
                        while (newRow > 0 && !board[newRow - 1][col]) {
                            board[newRow - 1][col] = board[newRow][col];
                            board[newRow][col] = null;
                            newRow--;
                            moved = true;
                        }
                        if (newRow > 0 && board[newRow - 1][col] === board[newRow][col]) {
                            board[newRow - 1][col] *= 2;
                            board[newRow][col] = null;
                            score += board[newRow - 1][col];
                            moved = true;
                        }
                    }
                }
            }
            break;
        case 'down':
            for (let col = 0; col < gridSize; col++) {
                for (let row = gridSize - 2; row >= 0; row--) {
                    if (board[row][col]) {
                        let newRow = row;
                        while (newRow < gridSize - 1 && !board[newRow + 1][col]) {
                            board[newRow + 1][col] = board[newRow][col];
                            board[newRow][col] = null;
                            newRow++;
                            moved = true;
                        }
                        if (newRow < gridSize - 1 && board[newRow + 1][col] === board[newRow][col]) {
                            board[newRow + 1][col] *= 2;
                            board[newRow][col] = null;
                            score += board[newRow + 1][col];
                            moved = true;
                        }
                    }
                }
            }
            break;
        case 'left':
            for (let row = 0; row < gridSize; row++) {
                for (let col = 1; col < gridSize; col++) {
                    if (board[row][col]) {
                        let newCol = col;
                        while (newCol > 0 && !board[row][newCol - 1]) {
                        board[row][newCol - 1] = board[row][newCol];
                        board[row][newCol] = null;
                        newCol--;
                        moved = true;
                        }
                        if (newCol > 0 && board[row][newCol - 1] === board[row][newCol]) {
                        board[row][newCol - 1] *= 2;
                        board[row][newCol] = null;
                        score += board[row][newCol - 1];
                        moved = true;
                        }
                        }
                        }
                        }
                        break;
                        case 'right':
                        for (let row = 0; row < gridSize; row++) {
                        for (let col = gridSize - 2; col >= 0; col--) {
                        if (board[row][col]) {
                        let newCol = col;
                        while (newCol < gridSize - 1 && !board[row][newCol + 1]) {
                        board[row][newCol + 1] = board[row][newCol];
                        board[row][newCol] = null;
                        newCol++;
                        moved = true;
                        }
                        if (newCol < gridSize - 1 && board[row][newCol + 1] === board[row][newCol]) {
                        board[row][newCol + 1] *= 2;
                        board[row][newCol] = null;
                        score += board[row][newCol + 1];
                        moved = true;
                        }
                        }
                        }
                        }
                        break;
                        }
                        if (moved) {
                        addRandomTile();
                        updateBoard();
                        }
                        }
                        function updateBoard() {
                        scoreContainer.textContent = score;
                        cells.forEach((cell, index) => {
                        const row = Math.floor(index / gridSize);
                        const col = index % gridSize;
                        if (board[row][col]) {
                        cell.textContent = board[row][col];
                        cell.classList.add(number-${board[row][col]});
                        } else {
                        cell.textContent = '';
                        cell.classList.remove('number-2', 'number-4', 'number-8', 'number-16', 'number-32', 'number-64', 'number-128', 'number-256', 'number-512', 'number-1024', 'number-2048');
                        }
                        });
                        }
                        function restartGame() {
                        score = 0;
                        initializeBoard();
                        updateBoard();
                        }
                        document.addEventListener('keydown', (event) => {
                        switch (event.key) {
                        case 'ArrowUp':
                        moveTiles('up');
                        break;
                        case 'ArrowDown':
                        moveTiles('down');
                        break;
                        case 'ArrowLeft':
                        moveTiles('left');
                        break;
                        case 'ArrowRight':
                        moveTiles('right');
                        break;
                        }
                        });
                        initializeBoard();
                        