const Graph = require('labs.graph');

const first = arr => arr[0];
const last = arr => arr[arr.length - 1];

const removeEdge = (arr, edge) => {
    const index = arr.indexOf(edge);
    if (index === -1) {
        return;
    }
    arr.splice(index, 1);
};

const getAdjacentEdges = (edges, vertex) => edges.reduce((acc, edge) => {
    if (edge.from === vertex || edge.to === vertex) {
        return [...acc, edge];
    }
    return acc;
}, []);

const wait = timeout => new Promise(resolve => {
    setTimeout(() => resolve(), timeout);
});

const getCycles = edges => {
    if (edges.length <= 1) {
        return [];
    }

    const allEdges = edges.slice();
    const cycles = [];

    while (allEdges.length !== 0) {
        const cycle = [allEdges.shift()];
        
        while (first(cycle).from !== last(cycle).to) {
            const adjacent = getAdjacentEdges(allEdges, last(cycle).to);

            const nextEdge = first(adjacent).from !== last(cycle).to
                ? Graph.createEdge(first(adjacent).to, first(adjacent).from)
                : first(adjacent);

            cycle.push(nextEdge);
            removeEdge(allEdges, first(adjacent));
        }

        cycles.push(cycle);
    }

    return cycles;
};

const findCycleWithSameVertex = (path, cycles) => {
    for (let i = 0; i < cycles.length; ++i) {
        const cycle = cycles[i];
        const insertIndex = cycle.map(({ to }) => to)
            .findIndex(vertex => path.some(edge => edge.to === vertex));

        if (insertIndex !== -1) {
            return { cycle, insertIndex };
        }
    }
};

const mergeCycles = cycles => {
    const path = [...cycles.shift()];

    while (cycles.length !== 0) {
        const result = findCycleWithSameVertex(path, cycles);
        if (!result) {
            throw new Error('Graph is not connected');
        }

        const { insertIndex, cycle } = result;
        cycles.splice(cycles.indexOf(cycle), 1);

        const insertVertex = cycle[insertIndex].to;
        const splitIndex = cycle.findIndex(edge => edge.to === insertVertex);

        path.splice(
            insertIndex + 1,
            0,
            ...[
                ...cycle.slice(splitIndex + 1),
                ... cycle.slice(0, splitIndex + 1)
            ]
        );
    }

    return path;
};

const solveEven = graph => {
    const edges = Graph.getEdges(graph);
    if (edges.length === 0) {
        return [];
    }

    const cycles = getCycles(edges);
    if (cycles.length === 0) {
        return [];
    }

    return mergeCycles(cycles);
};

const isEven = Graph.defineGraphFunction({
    [Graph.TYPES.EDGE_LIST]: edges => {
        const vertices = Graph.getVertices.impl[Graph.TYPES.EDGE_LIST](edges)
            .reduce((acc, vertex) => ({ ...acc, [vertex]: 0 }), {});
        edges.forEach(edge => {
            vertices[edge.from]++;
            vertices[edge.to]++;
        });
        return Object.values(vertices).every(count => count % 2 === 0);
    }
});

const solve = graph => {
    if (isEven(graph)) {
        return solveEven(graph);
    }
};

module.exports = {
    solve
};
