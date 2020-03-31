const Graph = require('labs.graph');
const chinesePostman = require('./chinese_postman');

const printPath = path => {
    console.log(`${path[0].from} -> ` +
        path.map(({ to }) => to).join(' -> '));
};

const graph = Graph.create(
    Graph.TYPES.EDGE_LIST,
    [
        Graph.createEdge('A', 'B'),
        Graph.createEdge('B', 'C'),
        Graph.createEdge('C', 'D'),
        Graph.createEdge('A', 'C'),
        Graph.createEdge('D', 'E'),
        Graph.createEdge('E', 'C'),
        Graph.createEdge('G', 'F'),
        Graph.createEdge('G', 'C'),
        Graph.createEdge('C', 'F')
        // Graph.createEdge('B', 'Z')
    ]
);

// Graph.print(graph, false);

printPath(chinesePostman.solve(graph));
