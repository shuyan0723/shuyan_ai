const size = 4; // 棋盘大小（4x4）
let board = []; // 棋盘数据（二维数组）
let score = 0; // 当前得分
const grid = document.getElementById('grid');
const scoreElement = document.querySelector('.score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

// 初始化游戏
function initGame() {
    board = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0;
    scoreElement.textContent = `得分：${score}`;
    gameOverElement.style.display = 'none';
    addNewNumber(); // 初始生成2个数字
    addNewNumber();
    renderBoard();
}

// 生成新数字（2或4）
function addNewNumber() {
    const emptyCells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) emptyCells.push({ i, j });
        }
    }
    if (emptyCells.length === 0) return; // 无空格，游戏结束
    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[i][j] = Math.random() < 0.9 ? 2 : 4; // 90%概率生成2，10%生成4
}

// 渲染棋盘到页面
function renderBoard() {
    grid.innerHTML = ''; // 清空旧内容
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = `cell ${board[i][j] ? `cell-${board[i][j]}` : ''}`;
            cell.textContent = board[i][j] || ''; // 0不显示数字
            grid.appendChild(cell);
        }
    }
}

// 处理移动逻辑（核心）
function move(direction) {
    let moved = false;
    const newBoard = board.map(row => [...row]); // 复制棋盘数据

    for (let i = 0; i < size; i++) {
        let row = [];
        if (direction === 'left' || direction === 'right') {
            row = newBoard[i];
        } else if (direction === 'up' || direction === 'down') {
            row = [newBoard[0][i], newBoard[1][i], newBoard[2][i], newBoard[3][i]];
        }

        // 修复：先反转原始行（右/下方向），合并后再反转回来
        let processedRow = [...row];
        if (direction === 'right' || direction === 'down') {
            processedRow = processedRow.reverse(); // 原始行反转（如 [2,2,0,0] → [0,0,2,2]）
        }
        const mergedRow = mergeRow(processedRow, direction); // 合并反转后的行（得到 [4,0,0,0]）
        if (direction === 'right' || direction === 'down') {
            mergedRow.reverse(); // 合并后反转回原方向（[4,0,0,0] → [0,0,0,4]）
        }

        // 更新棋盘数据
        if (direction === 'left' || direction === 'right') {
            newBoard[i] = mergedRow;
        } else {
            for (let j = 0; j < size; j++) {
                newBoard[j][i] = mergedRow[j];
            }
        }

        // 改进：逐个比较单元格判断是否移动（更严谨）
        for (let j = 0; j < size; j++) {
            if (newBoard[i][j] !== board[i][j]) {
                moved = true;
                break;
            }
        }
    }

    if (moved) {
        board = newBoard;
        addNewNumber();
        renderBoard();
        checkGameOver();
    }
}

// 检查游戏是否结束（修复后）
function checkGameOver() {
    // 检查是否有空格
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) return false;
        }
    }
    // 检查所有四个方向的相邻数字是否可合并
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const current = board[i][j];
            if (j > 0 && current === board[i][j - 1]) return false; // 左
            if (j < size - 1 && current === board[i][j + 1]) return false; // 右
            if (i > 0 && current === board[i - 1][j]) return false; // 上
            if (i < size - 1 && current === board[i + 1][j]) return false; // 下
        }
    }
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = score;
    return true;
}

// 监听键盘事件（修复后）
document.addEventListener('keydown', (e) => {
    // 阻止方向键的默认滚动行为
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
    }
    switch (e.key) {
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
    }
    scoreElement.textContent = `得分：${score}`;
});

// 重新开始游戏
function restartGame() {
    initGame();
}

// 合并单行/列（核心逻辑）
function mergeRow(row, direction) {
    let merged = [];
    let prev = null;
    for (const num of row) {
        if (num === 0) continue;
        if (prev === null) {
            prev = num;
        } else if (prev === num) {
            merged.push(prev + num);
            score += prev + num; // 更新得分
            prev = null;
        } else {
            merged.push(prev);
            prev = num;
        }
    }
    if (prev !== null) merged.push(prev);
    // 补0（根据方向填充左侧或右侧）
    const zeros = Array(size - merged.length).fill(0);
    return direction === 'left' || direction === 'up' ? [...merged, ...zeros] : [...zeros, ...merged];
}

// 初始化游戏
initGame();