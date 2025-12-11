const fs = require('fs');
const path = require('path');

/**
 * Solve the Battery Joltage Puzzle part 2
 */
function solve(banks) {
    // Use BigInt because the sum will exceed the limit of standard JavaScript numbers (2^53)
    let totalJoltage = 0n;

    banks.forEach((bank) => {
        const sequence = bank.trim();

        // Skip invalid lines if any
        if (sequence.length < 12) return;

        let resultNumber = "";
        let searchStartIndex = 0;

        // We need to find exactly 12 digits
        for (let digitsNeeded = 12; digitsNeeded > 0; digitsNeeded--) {

            // Calculate the end of our "Search Window"
            // If we need 'digitsNeeded' more numbers (including this one),
            // we must leave 'digitsNeeded - 1' characters remaining in the string.
            // Therefore, we cannot look past index: length - digitsNeeded
            const lastValidIndex = sequence.length - digitsNeeded;

            let maxDigit = -1;
            let foundIndex = -1;

            // Scan the window for the largest digit
            for (let i = searchStartIndex; i <= lastValidIndex; i++) {
                const currentDigit = parseInt(bank[i], 10);

                // Optimization: If we find a 9, we can't get any better.
                // Pick it immediately to keep the window as wide as possible for the next step.
                if (currentDigit === 9) {
                    maxDigit = 9;
                    foundIndex = i;
                    break;
                }

                if (currentDigit > maxDigit) {
                    maxDigit = currentDigit;
                    foundIndex = i;
                }
            }

            // Add the best digit we found to our result
            resultNumber += maxDigit;

            // Move our search start forward:
            // We can only look at numbers AFTER the one we just picked.
            searchStartIndex = foundIndex + 1;
        }

        totalJoltage += BigInt(resultNumber);
    });
    return totalJoltage;
}

// Read and pass input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');
const banks = rawInput.trim().split('\n');
console.log(`Answer: ${solve(banks)}`);