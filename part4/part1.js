const fs = require('fs');
const path = require('path');

/**
 * Solves the Forklift Access Puzzle
 */
function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let accessibleCount = 0;

    // Directions for the 8 neighbors (row offset, col offset)
    // [Up-Left, Up, Up-Right, Left, Right, Down-Left, Down, Down-Right]
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1]
    ];

    // Iterate through every cell
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {

            // We only care if the current cell is a paper roll (@)
            if (grid[r][c] === '@') {

                let neighborCount = 0;

                // Check all 8 neighbors
                for (const [dRow, dCol] of directions) {
                    const newRow = r + dRow;
                    const newCol = c + dCol;

                    // Check Bounds: Ensure we don't look outside the grid
                    if (newRow >= 0 && newRow < rows &&
                        newCol >= 0 && newCol < cols) {

                        if (grid[newRow][newCol] === '@') {
                            neighborCount++;
                        }
                    }
                }

                // Check the condition (Fewer than 4 neighbors)
                if (neighborCount < 4) {
                    accessibleCount++;
                }
            }
        }
    }
    return accessibleCount;
}

// Read input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');

// .trim() removes extra empty lines at the end of the file
const grid = rawInput.trim().split('\n').map(line => line.trim().split(''));
console.log(`Answer: ${solve(grid)}`);