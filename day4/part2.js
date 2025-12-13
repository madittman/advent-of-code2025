const fs = require('fs');
const path = require('path');

/**
 * Solves the Forklift Access Puzzle part 2
 */
function solve(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    // Directions for 8 neighbors
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1]
    ];

    let totalRemoved = 0;
    let running = true;

    console.log("Starting simulation...");

    // Keep looping until no more rolls can be removed
    while (running) {
        let rollsToRemove = [];

        // Step 1: Identify all candidates for removal in this generation
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {

                if (grid[r][c] === '@') {
                    let neighborCount = 0;

                    // Count neighbors
                    for (const [dRow, dCol] of directions) {
                        const newRow = r + dRow;
                        const newCol = c + dCol;

                        if (newRow >= 0 && newRow < rows &&
                            newCol >= 0 && newCol < cols) {

                            if (grid[newRow][newCol] === '@') {
                                neighborCount++;
                            }
                        }
                    }

                    // Rule: Fewer than 4 neighbors means we remove it
                    if (neighborCount < 4) {
                        rollsToRemove.push({r, c});
                    }
                }
            }
        }

        // Step 2: Apply the removals
        if (rollsToRemove.length > 0) {
            rollsToRemove.forEach(pos => {
                // Mark as removed (using '.' or 'x' doesn't matter,
                // as long as it's not '@')
                grid[pos.r][pos.c] = '.';
            });

            totalRemoved += rollsToRemove.length;
            // Uncomment the line below to see progress:
            // console.log(`Removed ${rollsToRemove.length} rolls.`);
        } else {
            // If nothing was removed, we are done
            running = false;
        }
    }
    return totalRemoved;
}

// Read input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');

// .trim() removes extra empty lines at the end of the file
const grid = rawInput.trim().split('\n').map(line => line.trim().split(''));
console.log(`Answer: ${solve(grid)}`);