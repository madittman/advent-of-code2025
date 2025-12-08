const fs = require('fs');
const path = require('path');

/**
 * Counting every time a full rotation hits zero
 */
function solve(rotations) {
    let currentPosition = 50;
    let zeroCount = 0;
    const dialSize = 100;

    rotations.forEach(rotation => {
        const direction = rotation.charAt(0);
        const amount = parseInt(rotation.substring(1), 10);

        if (direction === 'R') {
            currentPosition = (currentPosition + amount) % dialSize;
        } else if (direction === 'L') {
            // The Javascript modulo fix for negative numbers
            currentPosition = ((currentPosition - amount) % dialSize + dialSize) % dialSize;
        }
        // Check if zero was hit
        if (currentPosition === 0) {
            zeroCount++;
        }
    });
    return zeroCount;
}

// Read and pass input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');
const rotations = rawInput.trim().split('\n');
console.log(`Answer: ${solve(rotations)}`);