const Graph = require('labs.graph');
const { head, last, tail, isEmpty } = require('labs.utils');

const getTotalWeight = edges => edges.reduce((acc, { weight }) => acc + weight, 0);

const buildCycle = (vertices, edges) => {
    const _connects = (edge, vertex) => edge.has(vertex) && edge.connects(vertex, edge.other(vertex));

    const _findNextCycleEdge = (vertices, edges, lastVertex) => {
        if (isEmpty(edges)) {
            throw new Error("Can't find next cycle edge");
        }
        if (_connects(head(edges), lastVertex) && vertices.includes(head(edges).other(lastVertex))) {
            return head(edges);
        }
        return _findNextCycleEdge(vertices, tail(edges), lastVertex);
    };

    const _getLastVertex = cycle => {
        if (cycle.length === 1) {
            return head(cycle).vertices[1];
        }
        const preLast = cycle[cycle.length - 2];
        return last(cycle).other(
            last(cycle).has(preLast.vertices[0]) ? preLast.vertices[0] : preLast.vertices[1]
        );
    };

    const _buildCycle = (vertices, edges, cycle) => {
        if (isEmpty(vertices)) {
            return cycle;
        }
        const nextEdge = _findNextCycleEdge(vertices, edges, _getLastVertex(cycle));
        return _buildCycle(
            vertices.filter(vertex => !nextEdge.vertices.includes(vertex)),
            edges.filter(edge => edge !== nextEdge),
            [...cycle, nextEdge]
        );
    };

    const _completeCycle = (cycle, edges) => cycle.concat(edges.find(edge => {
        return edge.has(head(cycle).vertices[0]) && edge.has(_getLastVertex(cycle));
    }));

    if (isEmpty(edges)) {
        return [];
    }

    return _completeCycle(
        _buildCycle(
            vertices.filter(vertex => !head(edges).has(vertex)),
            tail(edges),
            [head(edges)]
        ),
        edges
    );
};

const solve = (graph, numberOfIterations = 100) => {
    const cycle = buildCycle(Graph.getVertices(graph), Graph.getEdges(graph));
    console.log(`[${cycle.join(', ')}] - ${getTotalWeight(cycle)}`);
};

module.exports = {
    solve
};
