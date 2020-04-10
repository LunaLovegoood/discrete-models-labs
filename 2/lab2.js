const Graph = require('labs.graph');
const chinesePostman = require('./chinese_postman');
const fs = require('fs');
const getInputFilePath = require('labs.get_input_path');

const printPath = path => {
    console.log(path.join(' -> '));
};

const graph = JSON.parse(fs.readFileSync(getInputFilePath(process.argv)));
graph.edges = graph.edges.map(vertices => Graph.createUndirectedEdge(...vertices));

Graph.print(graph, false);

printPath(chinesePostman.solve(graph));
