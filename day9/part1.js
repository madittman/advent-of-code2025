const fs = require('fs');
const path = require('path');

function solve(lines) {
    // Parse Coordinates
    const tiles = [];
    lines.forEach(line => {
        const parts = line.trim().split(',');
        if (parts.length === 2) {
            tiles.push({
                x: parseInt(parts[0], 10),
                y: parseInt(parts[1], 10)
            });
        }
    });
    console.log(`Parsed ${tiles.length} red tiles.`);

    let maxArea = 0;

    // Iterate through every unique pair
    // Compare tile[i] with every tile[j] that comes after it
    for (let i = 0; i < tiles.length; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
            const t1 = tiles[i];
            const t2 = tiles[j];

            // Calculate Dimensions
            // Add +1 because the range is inclusive (e.g. 5 to 7 is 5,6,7 = size 3)
            const width = Math.abs(t1.x - t2.x) + 1;
            const height = Math.abs(t1.y - t2.y) + 1;

            const area = width * height;
            if (area > maxArea) {
                maxArea = area;
            }
        }
    }

    return maxArea;
}

// Read and pass input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');
const XXX = rawInput.trim().split('\n');
console.log(`Answer: ${solve(XXX)}`);