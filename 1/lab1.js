const fs = require('fs');
const Graph = require('labs.graph');
const { getInputFilePath } = require('labs.utils');
const mst = require('./mst');

const graph = JSON.parse(fs.readFileSync(getInputFilePath(process.argv)));

Graph.print(graph);

console.log();
Graph.print(mst.boruvka(graph));
