const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const presetSelect = document.getElementById('preset');

const resolution = 10; // Each cell size (in pixels)
canvas.width = 500;
canvas.height = 500;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

let grid = buildGrid();
let animationId;

canvas.addEventListener('click', handleCanvasClick);

function buildGrid() {
    if (presetSelect.value == 'glider') {
        let array = new Array(COLS).fill(null)
            .map(() => new Array(ROWS).fill(null)
                .map(() => 0));
        const center_x = Math.floor(ROWS / 2);
        const center_y = Math.floor(COLS / 2);
        const x1 = center_x - 3;
        const x2 = x1 + 7;
        const y1 = center_y - 3;
        const y2 = y1 + 7;
        const gliderMatrix = [
            [1, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1],
        ]
        for (let i = y1; i < y2; i++) {
            for (let j = x1; j < x2; j++) {
                array[i][j] = gliderMatrix[j - x1][i - y1];
            }
        }
        return array;
    }
    else {
        return new Array(COLS).fill(null)
            .map(() => new Array(ROWS).fill(null)
                .map(() => Math.floor(Math.random() * 2)));
    }

}

function render(grid) {
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = cell ? 'black' : 'white';
            ctx.fill();
            ctx.stroke();
        }
    }
}

function nextGen(grid) {
    const nextGen = grid.map(arr => [...arr]);
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            let numNeighbors = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue;
                    let x_cell = col + i;
                    let y_cell = row + j;
                    if (x_cell < 0) {
                        x_cell = ROWS + x_cell;
                    }
                    if (y_cell < 0) {
                        y_cell = COLS + y_cell;
                    }
                    if (x_cell >= ROWS) {
                        x_cell = x_cell % ROWS;
                    }
                    if (y_cell >= COLS) {
                        y_cell = y_cell % COLS;
                    }

                    const currentNeighbor = grid[x_cell][y_cell];
                    numNeighbors += currentNeighbor;
                }
            }

            if (cell === 1 && numNeighbors < 2) {
                nextGen[col][row] = 0;
            } else if (cell === 1 && numNeighbors > 3) {
                nextGen[col][row] = 0;
            } else if (cell === 0 && numNeighbors === 3) {
                nextGen[col][row] = 1;
            }
        }
    }
    return nextGen;
}

function update() {
    grid = nextGen(grid);
    render(grid);
    animationId = requestAnimationFrame(update);
}

function startGame() {
    if (!animationId) {
        update();
    }
}

function stopGame() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function resetGame() {
    stopGame();
    grid = buildGrid();
    render(grid);
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / resolution);
    const row = Math.floor(y / resolution);

    grid[col][row] = grid[col][row] ? 0 : 1;
    render(grid);
}

render(grid);
