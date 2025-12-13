const fs = require('fs');
const path = require('path');

function solveCephalopodMath(lines) {
        // Find the maximum width to ensure we don't miss trailing columns
        const width = Math.max(...lines.map(line => line.length));
        const height = lines.length;

        let grandTotal = 0n; // Use BigInt for potentially huge products
        let currentProblemColumns = [];

        // Iterate through columns
        for (let x = 0; x < width; x++) {
            let columnContent = "";
            for (let y = 0; y < height; y++) {
                columnContent += lines[y][x] || " ";
            }

            // A column is "empty" if it only contains spaces
            const isEmpty = columnContent.trim().length === 0;

            if (!isEmpty) {
                // Collect characters for the current problem
                currentProblemColumns.push(columnContent);
            }

            // If we hit an empty column OR the end of the worksheet, process the collected block
            if ((isEmpty || x === width - 1) && currentProblemColumns.length > 0) {
                grandTotal += processProblemBlock(currentProblemColumns);
                currentProblemColumns = []; // Reset for next problem
            }
        }

        return grandTotal.toString();
}

/**
 * Processes a block of columns representing a single problem
 */
function processProblemBlock(columns) {
    const height = columns[0].length;
    let numbers = [];
    let operation = '';

    // Identify numbers in the top rows
    for (let y = 0; y < height - 1; y++) {
        let rowStr = "";
        for (let x = 0; x < columns.length; x++) {
            rowStr += columns[x][y];
        }

        const num = parseInt(rowStr.trim(), 10);
        if (!isNaN(num)) {
            numbers.push(BigInt(num));
        }
    }

    // Identify operation in the very last row
    let lastRowStr = "";
    for (let x = 0; x < columns.length; x++) {
        lastRowStr += columns[x][height - 1];
    }
    operation = lastRowStr.trim();

    // Perform the math
    if (numbers.length === 0) return 0n;

    if (operation === '+') {
        return numbers.reduce((acc, val) => acc + val, 0n);
    } else if (operation === '*') {
        return numbers.reduce((acc, val) => acc * val, 1n);
    }

    return 0n;
}

// Read and pass input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');
const lines = rawInput.trim().split('\n');
console.log(`Answer: ${solveCephalopodMath(lines)}`);