const fs = require('fs');
const path = require('path');

/**
 * Helper class for the Union-Find (Disjoint Set) Data Structure
 * Efficiently manages merging sets and tracking their sizes.
 */
class UnionFind {
    constructor(size) {
        // Parent array: parent[i] points to the parent of node i.
        // Initially, every node is its own parent.
        this.parent = new Array(size).fill(0).map((_, i) => i);

        // Size array: Tracks the number of nodes in the cluster rooted at i.
        // Initially, every cluster has size 1.
        this.size = new Array(size).fill(1);
    }

    // Find the representative (root) of the set containing element i
    // Uses path compression for O(1) average time complexity
    find(i) {
        if (this.parent[i] !== i) {
            this.parent[i] = this.find(this.parent[i]);
        }
        return this.parent[i];
    }

    // Merge the sets containing elements i and j
    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);

        if (rootI !== rootJ) {
            // Merge smaller set into larger set to keep tree flat
            if (this.size[rootI] < this.size[rootJ]) {
                this.parent[rootI] = rootJ;
                this.size[rootJ] += this.size[rootI];
            } else {
                this.parent[rootJ] = rootI;
                this.size[rootI] += this.size[rootJ];
            }
            return true; // Merged successfully
        }
        return false; // Already in the same set
    }

    // Get a list of the sizes of all distinct circuits currently existing
    getComponentSizes() {
        const sizes = [];
        // We only care about nodes that are their own parents (roots of circuits)
        for (let i = 0; i < this.parent.length; i++) {
            if (this.parent[i] === i) {
                sizes.push(this.size[i]);
            }
        }
        return sizes;
    }
}

function solve(lines) {
    // Parse Junction Boxes
    const boxes = lines.map((line, index) => {
        const parts = line.trim().split(',');
        return {
            id: index,
            x: parseInt(parts[0], 10),
            y: parseInt(parts[1], 10),
            z: parseInt(parts[2], 10)
        };
    });
    console.log(`Parsed ${boxes.length} junction boxes.`);

    // Generate all possible edges (pairs) and calculate distances
    // Note: Number of edges = N * (N - 1) / 2
    let edges = [];
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            const b1 = boxes[i];
            const b2 = boxes[j];

            // Euclidean distance squared: (x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2
            const distSq =
                Math.pow(b1.x - b2.x, 2) +
                Math.pow(b1.y - b2.y, 2) +
                Math.pow(b1.z - b2.z, 2);

            edges.push({ u: i, v: j, distSq: distSq });
        }
    }
    console.log(`Generated ${edges.length} possible connections.`);

    // Sort edges by distance (ascending)
    // JavaScript sort is efficient enough for this volume
    edges.sort((a, b) => a.distSq - b.distSq);

    // Initialize Union-Find
    const uf = new UnionFind(boxes.length);
    const connectionsToMake = 1000;

    // Connect the top 1000 pairs
    // The prompt says "connect... the 1000 pairs".
    // Iterate exactly 1000 times.
    for (let k = 0; k < connectionsToMake && k < edges.length; k++) {
        const edge = edges[k];

        // Attempt to connect. The DSU class handles the logic of
        // checking if they are already connected.
        // Even if they are already connected, this counts as one of our 1000 "steps".
        uf.union(edge.u, edge.v);
    }

    // Get final circuit sizes
    const circuitSizes = uf.getComponentSizes();

    // Sort descending to find the largest ones
    circuitSizes.sort((a, b) => b - a);

    // Calculate final answer by multiplying the sizes of the three largest circuits
    const top3Product =
        (circuitSizes[0] || 0) * (circuitSizes[1] || 0) * (circuitSizes[2] || 0);

    console.log(`Largest Circuits: ${circuitSizes.slice(0, 5).join(', ')}...`);
    return top3Product;
}

// Read and pass input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');
const lines = rawInput.trim().split('\n');
console.log(`Answer: ${solve(lines)}`);