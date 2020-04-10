const fs = require('fs');
const Graph = require('labs.graph');
const { getInputFilePath } = require('labs.utils');
const chinesePostman = require('./chinese_postman');

const printPath = path => {
    console.log(path.join(' -> '));
};

const graph = JSON.parse(fs.readFileSync(getInputFilePath(process.argv)));
graph.edges = graph.edges.map(vertices => Graph.createUndirectedEdge(...vertices));

Graph.print(graph, false);

printPath(chinesePostman.solve(graph));
