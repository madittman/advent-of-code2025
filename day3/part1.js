const fs = require('fs');
const path = require('path');

/**
 * Solve the Battery Joltage Puzzle
 */
function solve(banks) {
    let totalJoltage = 0;

    // Process each bank
    banks.forEach((bank) => {
        // Remove any whitespace
        const sequence = bank.trim();

        // We need at least 2 batteries to form a connection
        if (sequence.length < 2) return;

        // Find the max joltage for this specific bank
        // We check from 99 down to 11. The first valid one we find is the max.
        let maxJoltage = 0;

        for (let candidate = 99; candidate >= 11; candidate--) {
            const candidateStr = candidate.toString();
            const tensChar = candidateStr[0]; // e.g., "9"
            const onesChar = candidateStr[1]; // e.g., "2"

            // Strategy:
            // To form the number, the tens digit must appear BEFORE the ones digit.
            // We maximize our chances by finding the VERY FIRST tens digit
            // and the VERY LAST ones digit.
            const firstTensIndex = sequence.indexOf(tensChar);
            const lastOnesIndex = sequence.lastIndexOf(onesChar);

            // Check validity:
            // 1. Does the tens digit exist? (index != -1)
            // 2. Does the ones digit exist AFTER the tens digit?
            if (firstTensIndex !== -1 && lastOnesIndex > firstTensIndex) {
                maxJoltage = candidate;
                break; // We found the highest possible number, stop checking this bank
            }
        }

        totalJoltage += maxJoltage;
    });
    return totalJoltage;
}

// Read and pass input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');
const banks = rawInput.trim().split('\n');
console.log(`Answer: ${solve(banks)}`);