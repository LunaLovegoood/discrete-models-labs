const Graph = require('labs.graph');
const { head, last, tail, isEmpty } = require('labs.utils');

const getTotalWeight = edges => edges.reduce((acc, { weight }) => acc + weight, 0);

const buildCycle = (vertices, edges) => {
    const _findNextCycleEdge = (vertices, edges, lastVertex) => edges
        .filter(edge => edge.has(lastVertex) && edge.connects(lastVertex, edge.other(lastVertex)))
        .find(edge => vertices.includes(edge.other(lastVertex)));

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
        if (!nextEdge) {
            throw new Error("Can't find next cycle edge");
        }

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

const VertexCycle = vertices => ({
    at: index => vertices[(index + vertices.length) % vertices.length]
});

const getVerticesFromCycle = cycle => cycle.slice(1).reduce(
    (vertices, edge) => [...vertices, edge.other(last(vertices))],
    cycle[1].has(cycle[0].vertices[0])
        ? cycle[0].vertices[0]
        : cycle[0].vertices[1]
);

const swap = edges => {
    const findEdge = (first, second) => edges.find(
        edge => edge.has(first) && edge.has(second)
    );

    const replaceEdge = (cycle, xi, xj, newxi, newxj) => {
        if (newxi === newxj) {
            return;
        }

        const newEdge = findEdge(newxi, newxj);
        const oldIndex = cycle.findIndex(edge => edge.has(xi) && edge.has(xj));
        cycle.splice(oldIndex, 1, newEdge);
    };

    return (cycle, i, j) => {
        const vertices = VertexCycle(getVerticesFromCycle(cycle));
        const x = {
            'i-1': vertices.at(i - 1),
            'i':   vertices.at(i),
            'i+1': vertices.at(i + 1),
            'j-1': vertices.at(j - 1),
            'j':   vertices.at(j),
            'j+1': vertices.at(j + 1),
        };

        const newCycle = cycle.slice();
        replaceEdge(newCycle, x['i-1'], x['i'],   x['i-1'], x['j']);
        replaceEdge(newCycle, x['i'],   x['i+1'], x['j'],   x['i+1']);
        replaceEdge(newCycle, x['j-1'], x['j'],   x['j-1'], x['i']);
        replaceEdge(newCycle, x['j'],   x['j+1'], x['i'],   x['j+1']);

        return newCycle;
    }
};

const factorial = n => n === 0 ? 1 : n * factorial(n - 1);

const solve = (graph, iterationsLimit = 100) => {
    const n = Graph.getVertices(graph).length;
    const numberOfIterations = Math.min(factorial(n - 1)/2, iterationsLimit);
    const getSwappedCycle = swap(Graph.getEdges(graph));

    let cycle = buildCycle(Graph.getVertices(graph), Graph.getEdges(graph));
    console.log(`[${cycle.join(', ')}] - ${getTotalWeight(cycle)}`);

    let iter = 0;
    for (let i = 0; i < (n - 1); ++i) {
        for (let j = i + 1; j < n; ++j) {
            if (iter >= numberOfIterations) {
                break;
            }

            const swapped = getSwappedCycle(cycle, i, j);
            if (getTotalWeight(swapped) < getTotalWeight(cycle)) {
                cycle = swapped;
            }

            ++iter;
        }
    }

    console.log(`Final cycle: [${cycle.join(', ')}] - ${getTotalWeight(cycle)}`);
    
    return cycle;
};

module.exports = {
    solve
};
