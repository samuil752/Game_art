const gridSize = 20;
const mineCount = 30;
const grid = [];
let gameOver = false;
let gameWon = false;
var revealCounter = 0;
const minesweeper = document.getElementById("minesweeper");

let hasReset = false; 
let userKey; //user entered key

function startTimer(durationInSeconds) {
    const timerElement = document.getElementById("timer");
    let timeRemaining = durationInSeconds;

    const intervalId = setInterval(() => {
        timerElement.textContent = timeRemaining;
        timeRemaining--;

        if (timeRemaining < 0 || gameOver) {
            clearInterval(intervalId); // Stop the timer when it reaches 0
            timerElement.textContent = "Time's up!";
            gameOver = true;
            alert("*BEEP* - /Door permanently locked/");
            revealAllMines(); // Assuming you have a function to reveal mines
            return;
        }
    }, 1000); // Runs every 1000ms (1 second)

    // Add a click event listener to reset the timer
    timerElement.addEventListener("click", () => {
        console.log(userKey);
        if (!hasReset && ("Shadow"==userKey)) {
            hasReset = true; // Set the flag to true after the first reset
            clearInterval(intervalId); // Stop the current timer
            startTimer(60); // Restart the timer with 60 seconds
        } else {
        }
    });
}

// Start the timer initially with 60 seconds
startTimer(60);







// Initialize the grid
function createGrid() {
    //gameOver = false;
    // gameWon = false;
    for (let row = 0; row < gridSize; row++) {
        const rowArray = [];
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", () => revealCell(row, col));
            minesweeper.appendChild(cell);
            rowArray.push({
                element: cell,
                hasMine: false,
                revealed: false,
                adjacentMines: 4,
            });
        }
        grid.push(rowArray);
    }
    placeMines();
}

// Place mines randomly
function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        if (!grid[row][col].hasMine) {
            grid[row][col].hasMine = true;
            minesPlaced++;
            updateAdjacentCounts(row, col);
        }
    }
    userKey = prompt("/*Beep*-door-locked!/ Remember what the fire told you? Say here and you shall have more time, if you press the timer.");
}

// Update adjacent mine counts
function updateAdjacentCounts(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (isInBounds(newRow, newCol) && !grid[newRow][newCol].hasMine) {
                grid[newRow][newCol].adjacentMines--;
            }
        }
    }
}

// Check if a position is within bounds
function isInBounds(row, col) {
    return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
}

// Reveal a cell
function revealCell(row, col) {
    if (gameOver || grid[row][col].revealed || gameWon) return;

    const cell = grid[row][col];
    cell.revealed = true;
    revealCounter++;

    if (cell.hasMine) {
        cell.element.classList.add("mine");
        gameOver = true;
        return;
    }

    cell.element.classList.add("revealed");

    if (revealCounter >= 370) {
        gameWon = true;
        revealAllMines();
        alert("door unlocked.");
        window.open("puzzleDoors.html", "_self");
        return;
    }

    if (cell.adjacentMines < 4) {
        cell.element.textContent = cell.adjacentMines;
    } else {
        revealAdjacentCells(row, col);
    }
}

// Reveal all mines when the game is over
function revealAllMines() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = grid[row][col];
            if (cell.hasMine) {
                cell.element.classList.add("mine");
            }
        }
    }
}

// Reveal adjacent cells recursively
function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (isInBounds(newRow, newCol) && !grid[newRow][newCol].revealed) {
                revealCell(newRow, newCol);
            }
        }
    }
}

// Start the game
createGrid();