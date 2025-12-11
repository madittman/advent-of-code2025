const fs = require('fs');
const path = require('path');

/**
 * Sum up all invalid IDs
 */
function solve(ranges) {
    let invalid_ids = []

    // Get numbers from range string
    function get_numbers_from_range(range) {
        let split_range = range.split("-");
        let start = Number(split_range[0]);
        let end = Number(split_range[1]);
        let numbers = [];
        while (start !== end) {
            numbers.push(start);
            start++;
        }
        numbers.push(end);
        return numbers;
    }

    function is_invalid(number) {
        let half_length = Math.floor(number.length / 2);
        for (let i = 0; i < half_length; i++) {
            let sequence = number.substring(0, i + 1);
            let repetitions = Math.floor(number.length / sequence.length);
            if (sequence.repeat(repetitions) === number) {
                return true;
            }
        }
        return false;
    }

    ranges.forEach(range => {
        let numbers = get_numbers_from_range(range);
        for (let number of numbers) {
            if (is_invalid(String(number))) {
                invalid_ids.push(number);
            }
        }
    });

    // Sum up invalid IDs
    let sum = 0;
    invalid_ids.forEach(x => {
        sum += x;
    });
    return sum;
}

// Read and pass input
const inputPath = path.join(__dirname, 'input');
const rawInput = fs.readFileSync(inputPath, 'utf-8');
const ranges = rawInput.trim().split(',');
console.log(`Answer: ${solve(ranges)}`);