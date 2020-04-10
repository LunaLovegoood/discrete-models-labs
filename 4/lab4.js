const Graph = require('labs.graph');
const fs = require('fs');
const { getInputFilePath } = require('labs.utils');
const salesman = require('./salesman');

const graph = JSON.parse(fs.readFileSync(getInputFilePath(process.argv)));
graph.edges = graph.edges.map(vertices => Graph.createUndirectedEdge(...vertices));

Graph.print(graph);

console.log();
salesman.solve(graph);
