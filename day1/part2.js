const fs = require('fs');
const path = require('path');

/**
 * Solves Counting every time we hit zero
 */
function solve(rotations) {
    let currentPosition = 50;
    let zeroCount = 0;
    const dialSize = 100;

    rotations.forEach(rotation => {
        const direction = rotation.charAt(0);
        const amount = parseInt(rotation.substring(1), 10);

        // Inner loop one by one
        for (let i = 0; i < amount; i++) {
            if (direction === 'R') {
                currentPosition = (currentPosition + 1) % dialSize;
            } else {
                // Add dialSize before modulo to handle the wrap from 0 -> 99
                currentPosition = (currentPosition - 1 + dialSize) % dialSize;
            }
            // Check if zero was hit
            if (currentPosition === 0) {
                zeroCount++;
            }
        }
    });
    return zeroCount;
}

// Read and pass input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');
const rotations = rawInput.trim().split('\n');
console.log(`Answer: ${solve(rotations)}`);