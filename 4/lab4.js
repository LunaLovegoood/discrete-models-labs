const Graph = require('labs.graph');
const fs = require('fs');
const getInputFilePath = require('labs.get_input_path');

const graph = JSON.parse(fs.readFileSync(getInputFilePath(process.argv)));
graph.edges = graph.edges.map(vertices => Graph.createUndirectedEdge(...vertices));

Graph.print(graph);
