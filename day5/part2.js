const fs = require('fs');
const path = require('path');

/**
 * Solves the Inventory Management Puzzle
 */
function solve(rangeLines) {
    // Parse ranges into objects { start, end }
    let ranges = [];
    rangeLines.forEach(line => {
        const parts = line.trim().split('-');
        if (parts.length === 2) {
            ranges.push({
                start: parseInt(parts[0], 10),
                end: parseInt(parts[1], 10)
            });
        }
    });
    if (ranges.length === 0) {
        console.log("No ranges found.");
        return;
    }

    // Sort ranges by start value (Ascending)
    ranges.sort((a, b) => a.start - b.start);

    // Merge Overlapping Intervals
    const mergedRanges = [];
    let currentRange = ranges[0];

    for (let i = 1; i < ranges.length; i++) {
        const nextRange = ranges[i];

        // If the next range starts inside (or immediately after) the current range
        if (nextRange.start <= currentRange.end + 1) {
            // Merge them: The new end is the max of both ends
            // We use Math.max because the current range might already fully engulf the next one
            currentRange.end = Math.max(currentRange.end, nextRange.end);
        } else {
            // No overlap: Push the current range to our list and start a new one
            mergedRanges.push(currentRange);
            currentRange = nextRange;
        }
    }
    mergedRanges.push(currentRange);

    // Calculate Total Count
    let freshCount = 0;
    mergedRanges.forEach(range => {
        // The number of integers in a range [A, B] is (B - A) + 1
        // Example: 3-5 is (5-3)+1 = 3 integers (3, 4, 5)
        const count = (range.end - range.start) + 1;
        freshCount += count;
    });

    return freshCount;
}

// Read input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');

// 1. We only care about the first section (ranges)
// Split by double newline to separate ranges from the now-irrelevant ID list
const sections = rawInput.trim().split(/\n\s*\n/);
const rangeLines = sections[0].trim().split('\n');
console.log(`Answer: ${solve(rangeLines)}`);