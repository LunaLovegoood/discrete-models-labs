const fs = require('fs');

const T = 7;
const N = 5;

const KeyPoint = (name, input, output) => ({
    name,
    input,
    output,
    capacity: 0
});

/**
 * @typedef {object} Stream
 * @property {number} a
 * @property {number} b
 * @property {number} c
 */

const getInputFilePath = argv => {
    const inputFilePath = argv[2];
    if (!inputFilePath) {
        console.log('Please provide path to input file.');
        process.exit(1);
    }
    if (!fs.existsSync(inputFilePath)) {
        console.log(`File "${inputFilePath}" doesn't exist.`);
        process.exit(1);
    }
    if (!inputFilePath.endsWith('.json')) {
        console.log('Input file should be a JSON file.');
        process.exit(1);
    }
    return inputFilePath;
};

/**
 * @param {string} inputFilePath
 * @returns {Stream[]}
 */
const readThread = inputFilePath => JSON.parse(fs.readFileSync(inputFilePath));

const thread = readThread(getInputFilePath(process.argv));

const Sr = Array.from({ length: N }, (_, i) => KeyPoint(i, 0, 0));

for (let i = 0; i < N; ++i) {
    for (let j = 0; j < T; ++j) {
        if (Sr[i].name === thread[j].a) {
            Sr[i].output += thread[j].c;
        }
        if (Sr[i].name === thread[j].b) {
            Sr[i].input += thread[j].c;
        }
    }
}

Sr[N - 2].input = Sr[N - 2].output;
Sr[N - 1].output = Sr[N - 1].input;

for (let i = 0; i < N; ++ i) {
    Sr[i].capacity = Math.max(Sr[i].input, Sr[i].output);
}
const maxThreadCapacity = Math.max(Sr[N - 1].capacity, Sr[N - 2].capacity);

for (let j = 0; j < T; ++j) {
    if (thread[j].b === (N - 1)) {
        Sr[N - 1].capacity -= Math.min(thread[j].c, Sr[thread[j].a].capacity);
    }
}

for (let i = N - 3; i >= 0; --i) {
    for (let j = 0; j < T; ++j) {
        if (thread[j].b === i) {
            Sr[i].capacity -= Math.min(thread[j].c, Sr[thread[j].a].capacity);
        }
    }
}

console.log(`Maximum thread capacity: ${maxThreadCapacity}`);
