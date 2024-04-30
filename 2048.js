let board;
let score = 0;
const rows = 4;
const columns = 4;
const maxScore = 8192;

window.addEventListener("keydown", function(e) {
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
});

window.onload = function() {
    setGame();
    addDirectionalButtonListeners();
    document.getElementById("reset-game").addEventListener("click", resetGame);
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            resetGame();
        }
    });
    checkGameOver();
}

function resetGame() {
    window.location.reload();
}

function setGame() {
    board = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            updateTile(tile, board[r][c]);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        tile.classList.add(num <= maxScore ? "x" + num.toString() : "x8192");
    }
}

document.addEventListener('keyup', (e) => {
    handleKeyInput(e.code);
    document.getElementById("score").innerText = score;
    checkGameOver();
});

function handleKeyInput(keyCode) {
    switch (keyCode) {
        case "ArrowLeft":
            slideLeft();
            setTwo();
            break;
        case "ArrowRight":
            slideRight();
            setTwo();
            break;
        case "ArrowUp":
            slideUp();
            setTwo();
            break;
        case "ArrowDown":
            slideDown();
            setTwo();
            break;
        default:
            break;
    }
}

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        const row = board[r];
        const updatedRow = slide(row);
        board[r] = updatedRow;
        for (let c = 0; c < columns; c++) {
            const tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        const row = board[r];
        const reversedRow = row.slice().reverse();
        const updatedRow = slide(reversedRow);
        const originalRow = updatedRow.slice().reverse();
        board[r] = originalRow;
        for (let c = 0; c < columns; c++) {
            const tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        const column = board.map(row => row[c]);
        const updatedColumn = slide(column);
        for (let r = 0; r < rows; r++) {
            board[r][c] = updatedColumn[r];
            const tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        const column = board.map(row => row[c]);
        const reversedColumn = column.slice().reverse();
        const updatedColumn = slide(reversedColumn);
        const originalColumn = updatedColumn.slice().reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = originalColumn[r];
            const tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    while (true) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * columns);
        if (board[r][c] === 0) {
            board[r][c] = 2;
            const tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 2);
            break;
        }
    }
}

function hasEmptyTile() {
    return board.some(row => row.includes(0));
}

function addDirectionalButtonListeners() {
    document.getElementById("up-button").addEventListener("click", () => simulateKeyEvent("ArrowUp"));
    document.getElementById("left-button").addEventListener("click", () => simulateKeyEvent("ArrowLeft"));
    document.getElementById("down-button").addEventListener("click", () => simulateKeyEvent("ArrowDown"));
    document.getElementById("right-button").addEventListener("click", () => simulateKeyEvent("ArrowRight"));
}

function simulateKeyEvent(keyCode) {
    document.dispatchEvent(new KeyboardEvent('keyup', { 'code': keyCode }));
}

function checkGameOver() {
    if (!hasMovesLeft()) {
        gameOver();
    }
}

function hasMovesLeft() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return true;
            }
            if (r > 0 && board[r - 1][c] === 0) {
                return true;
            }
            if (r < rows - 1 && board[r + 1][c] === 0) {
                return true;
            }
            if (c > 0 && board[r][c - 1] === 0) {
                return true;
            }
            if (c < columns - 1 && board[r][c + 1] === 0) {
                return true;
            }
            const currentTile = board[r][c];
            if (r > 0 && board[r - 1][c] === currentTile) {
                return true;
            }
            if (r < rows - 1 && board[r + 1][c] === currentTile) {
                return true;
            }
            if (c > 0 && board[r][c - 1] === currentTile) {
                return true;
            }
            if (c < columns - 1 && board[r][c + 1] === currentTile) {
                return true;
            }
        }
    }
    return false;
}

function gameOver() {
    const modal = document.getElementById('modal');
    const scoreSpan = modal.querySelector('.score');
    scoreSpan.textContent = score;
    modal.classList.add('appear');
    const playAgainBtn = modal.querySelector('.play-again');
    playAgainBtn.addEventListener('click', () => {
        window.location.reload();
    });
}