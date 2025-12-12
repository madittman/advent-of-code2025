const fs = require('fs');
const path = require('path');

/**
 * Solves the Inventory Management Puzzle
 */
function solve(sections) {
    if (sections.length < 2) {
        console.error("Error: Could not find two distinct sections in input.");
        return;
    }

    const rangeSection = sections[0].trim().split('\n');
    const idSection = sections[1].trim().split('\n');

    // Parse the Range Objects
    const ranges = [];
    rangeSection.forEach(line => {
        const parts = line.trim().split('-');
        if (parts.length === 2) {
            ranges.push({
                min: parseInt(parts[0], 10),
                max: parseInt(parts[1], 10)
            });
        }
    });

    console.log(`Loaded ${ranges.length} fresh ranges.`);

    // Check each ID against the ranges
    let freshCount = 0;

    idSection.forEach(line => {
        const id = parseInt(line.trim(), 10);
        if (isNaN(id)) return;

        // Check if this ID exists in ANY range
        // .some() stops as soon as it finds one match (efficient)
        const isFresh = ranges.some(range => id >= range.min && id <= range.max);

        if (isFresh) {
            freshCount++;
        }
    });

    return freshCount;
}

// Read input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');

// Split the file into two sections: Ranges and IDs
// We split by a double newline because the prompt says "a blank line" separates them.
// Depending on your OS (Windows vs Mac/Linux), this might be \r\n\r\n or \n\n.
// We use a regex to be safe.
const sections = rawInput.trim().split(/\n\s*\n/);
console.log(`Answer: ${solve(sections)}`);