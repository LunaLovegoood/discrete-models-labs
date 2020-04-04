const Graph = require('labs.graph');
const chinesePostman = require('./chinese_postman');

const printPath = path => {
    console.log(path.join(' -> '));
};

const graph = Graph.create(
    Graph.TYPES.EDGE_LIST,
    [
        'A', 'B', 'C', 'D', 'E', 'F', 'G'
    ],
    [
        Graph.createUndirectedEdge('A', 'B'),
        Graph.createUndirectedEdge('B', 'C'),
        Graph.createUndirectedEdge('C', 'D'),
        Graph.createUndirectedEdge('A', 'C'),
        Graph.createUndirectedEdge('D', 'E'),
        Graph.createUndirectedEdge('E', 'C'),
        Graph.createUndirectedEdge('G', 'F'),
        Graph.createUndirectedEdge('G', 'C'),
        Graph.createUndirectedEdge('C', 'F'),
    ]
);

// Graph.print(graph, false);

printPath(chinesePostman.solve(graph));
