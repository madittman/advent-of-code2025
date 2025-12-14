const fs = require('fs');
const path = require('path');

/**
 * Union-Find (Disjoint Set) with Component Tracking
 */
class UnionFind {
    constructor(size) {
        this.parent = new Array(size).fill(0).map((_, i) => i);
        // Track how many separate groups exist. Starts equal to N.
        this.componentCount = size;
    }
    find(i) {
        if (this.parent[i] !== i) {
            this.parent[i] = this.find(this.parent[i]);
        }
        return this.parent[i];
    }
    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);

        if (rootI !== rootJ) {
            this.parent[rootI] = rootJ;
            // Successful merge means one less independent group exists
            this.componentCount--;
            return true;
        }
        return false;
    }
}

function solve(lines) {
    const boxes = lines.map((line, index) => {
        const parts = line.trim().split(',');
        return {
            id: index,
            x: parseInt(parts[0], 10),
            y: parseInt(parts[1], 10),
            z: parseInt(parts[2], 10)
        };
    });

    // Generate Edges
    let edges = [];
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            const b1 = boxes[i];
            const b2 = boxes[j];
            const distSq =
                Math.pow(b1.x - b2.x, 2) +
                Math.pow(b1.y - b2.y, 2) +
                Math.pow(b1.z - b2.z, 2);
            edges.push({ u: i, v: j, distSq: distSq });
        }
    }

    // Sort Edges (Ascending Distance)
    edges.sort((a, b) => a.distSq - b.distSq);

    // Connect until fully unified
    const uf = new UnionFind(boxes.length);

    for (const edge of edges) {
        // Attempt to connect
        const wasMerged = uf.union(edge.u, edge.v);
        if (wasMerged) {
            // If this merge brought us down to exactly 1 component,
            // this was the final necessary connection.
            if (uf.componentCount === 1) {
                const box1 = boxes[edge.u];
                const box2 = boxes[edge.v];

                // "Multiply together the X coordinates of the last two junction boxes"
                // Use BigInt just in case coordinates are large
                const result = BigInt(box1.x) * BigInt(box2.x);
                console.log(`Last connected pair: ID ${edge.u} and ID ${edge.v}`);
                console.log(`X coordinates: ${box1.x} and ${box2.x}`);
                return result;
            }
        }
    }
}

// Read and pass input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');
const lines = rawInput.trim().split('\n');
console.log(`Answer: ${solve(lines)}`);