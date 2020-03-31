const fs = require('fs');
const Graph = require('./graph');

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

const graph = Graph.create(
    Graph.types.WEIGHT_MATRIX,
    JSON.parse(fs.readFileSync(getInputFilePath(process.argv)))
);

Graph.print(graph);
Graph.print(Graph.MST.prim(graph));
