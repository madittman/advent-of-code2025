const fs = require('fs');
const path = require('path');

function solveCephalopodMath(lines) {
    // Calculate dimensions
    const width = Math.max(...lines.map(line => line.length));
    const height = lines.length;

    // Ensure all lines are padded to the full width with spaces
    // This prevents "undefined" errors when accessing short lines
    const paddedLines = lines.map(line => line.padEnd(width, ' '));

    let grandTotal = 0n;
    let currentBlockColumns = [];

    // Scan horizontally to group columns into problems
    for (let x = 0; x < width; x++) {
        let columnStr = "";
        for (let y = 0; y < height; y++) {
            columnStr += paddedLines[y][x];
        }

        // A separator is a column that is purely spaces
        const isSeparator = columnStr.trim().length === 0;

        if (!isSeparator) {
            currentBlockColumns.push(columnStr);
        }

        // If we hit a separator OR the end of the line, process the block
        if ((isSeparator || x === width - 1) && currentBlockColumns.length > 0) {
            grandTotal += calculateVerticalBlock(currentBlockColumns);
            currentBlockColumns = []; // Reset for the next problem
        }
    }

    return grandTotal.toString();
}

/**
 * Calculates the result of a single problem block using Vertical logic
 */
function calculateVerticalBlock(columns) {
    let numbers = [];
    let operator = null;

    // The height of the actual content in the block
    const blockHeight = columns[0].length;

    // Process each column to find ONE number per column
    columns.forEach(col => {
        // Extract digits: Everything except the last character
        // The last character is reserved for the operator line
        const digitPart = col.slice(0, blockHeight - 1);

        // Check the last character for an operator
        const bottomChar = col[blockHeight - 1];
        if (bottomChar === '+' || bottomChar === '*') {
            operator = bottomChar;
        }

        // Clean up the digits (remove spaces)
        // Example: " 6 2 " -> "62"
        const cleanDigits = digitPart.replace(/\s/g, '');

        // If there are digits in this column, parse them
        if (cleanDigits.length > 0) {
            numbers.push(BigInt(cleanDigits));
        }
    });

    if (!operator || numbers.length === 0) return 0n;

    // 4. Perform the math
    if (operator === '+') {
        return numbers.reduce((acc, val) => acc + val, 0n);
    } else if (operator === '*') {
        return numbers.reduce((acc, val) => acc * val, 1n);
    }

    return 0n;
}

// Read and pass input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');
const lines = rawInput.trim().split('\n');
console.log(`Answer: ${solveCephalopodMath(lines)}`);