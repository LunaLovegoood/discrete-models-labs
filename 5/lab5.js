const Graph = require('labs.graph');
const fs = require('fs');
const { getInputFilePath } = require('labs.utils');
const { areIsomorphic } = require('./isomorphism');

const { first, second } = JSON.parse(fs.readFileSync(getInputFilePath(process.argv)));
first.edges = first.edges.map(vertices => Graph.createUndirectedEdge(...vertices));
second.edges = second.edges.map(vertices => Graph.createUndirectedEdge(...vertices));

Graph.print(first, false);
Graph.print(second, false);

console.log();
console.log(`Are isomorphic: ${areIsomorphic(first, second)}`);
