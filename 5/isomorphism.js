const Graph = require('labs.graph');

const changeVerticeNames = (isomorphic, graph) => {
    const initialVertices = Graph.getVertices(graph);

    const getVerticeName = (isomorphic, edge, isFirst) => {
        const vertex = isFirst ? edge.first : edge.second;
        return Graph.getVertices(isomorphic)[initialVertices.indexOf(vertex)];
    };

    if (Graph.getEdges(graph).length !== Graph.getEdges(isomorphic).length) {
        return;
    }

    for (const edge of Graph.getEdges(graph)) {
        edge.first = getVerticeName(isomorphic, edge, true);
        edge.second = getVerticeName(isomorphic, edge, false);
    }
};

const sameVertices = (edge, vertex1, vertex2) => edge.has(vertex1) && edge.has(vertex2);

const swap = (graph, i, j) => {
    const newEdges = [];
    const vertex1 = Graph.getVertices(graph)[i];
    const vertex2 = Graph.getVertices(graph)[j];
    
    for (const edge of Graph.getEdges(graph)) {
        if (sameVertices(edge, vertex1, vertex2)) {
            newEdges.push(Graph.createUndirectedEdge(edge.second, edge.first));
        }
        else if (edge.first == vertex1) {
            newEdges.push(Graph.createUndirectedEdge(vertex2, edge.second));
        }
        else if (edge.second == vertex1) {
            newEdges.push(Graph.createUndirectedEdge(edge.first, vertex2));
        }
        else if (edge.first == vertex2) {
            newEdges.push(Graph.createUndirectedEdge(vertex1, edge.second));
        }
        else if (edge.second == vertex2) {
            newEdges.push(Graph.createUndirectedEdge(edge.first, vertex1));
        }
        else {
            newEdges.push(Graph.createUndirectedEdge(edge.first, edge.second));
        }
    }

    return newEdges;
};

const reverse = (graph, m) => {
    let i = 0;
    let j = m;
    while (i < j) {
        graph.edges = swap(graph, i++, j--);
    }
};

const antiFlex = (isomorphic, graph, m = Graph.getVertices(graph).length - 1) => {
    let isEqual = false;

    const execute = (isomorphic, graph, m) => {
        if (m === 0) {
            if (Graph.equals(isomorphic, graph)) {
                isEqual = true;
            }
            return;
        }
    
        for (let i = 0; i <= m; ++i) {
            execute(isomorphic, graph, m - 1);
            if (i < m) {
                graph.edges = swap(graph, i, m);
                reverse(graph, m - 1);
            }
        }
    };

    execute(isomorphic, graph, m);

    return isEqual;
};

const areIsomorphic = (isomorphic, graph) => {
    changeVerticeNames(isomorphic, graph);
    return antiFlex(isomorphic, graph);
};

module.exports = {
    areIsomorphic
};
