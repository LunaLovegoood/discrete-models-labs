const Graph = require('labs.graph');
const { first, last } = require('labs.utils');

const removeElement = (arr, el) => {
    const index = arr.indexOf(el);
    if (index === -1) {
        return;
    }
    arr.splice(index, 1);
};

const getAdjacentEdges = (edges, vertex) => edges.reduce(
    (acc, edge) => edge.connects(vertex, edge.other(vertex)) ? [...acc, edge] : acc, []);

const getCycles = edges => {
    if (edges.length <= 1) {
        return [];
    }

    const allEdges = edges.slice();
    const cycles = [];

    while (allEdges.length !== 0) {
        const cycle = [...allEdges.shift().vertices];
        
        while (first(cycle) !== last(cycle)) {
            const adjacent = getAdjacentEdges(allEdges, last(cycle));
            cycle.push(first(adjacent).other(last(cycle)));
            removeElement(allEdges, first(adjacent));
        }

        cycles.push(cycle);
    }

    return cycles;
};

const findCycleWithSameVertex = (path, cycles) => {
    for (let i = 0; i < cycles.length; ++i) {
        const cycle = cycles[i];
        const insertIndex = path.findIndex(vertex => cycle.includes(vertex));

        if (insertIndex !== -1) {
            return { cycle, insertIndex };
        }
    }
};

const mergeCycles = cycles => {
    const path = [...cycles.shift()];

    // remove duplicated last elements
    cycles = cycles.map(cycle => cycle.slice(0, cycle.length - 1));

    while (cycles.length !== 0) {
        const result = findCycleWithSameVertex(path, cycles);
        if (!result) {
            throw new Error('Graph is not connected');
        }

        const { insertIndex, cycle } = result;
        cycles.splice(cycles.indexOf(cycle), 1);

        const splitIndex = cycle.indexOf(path[insertIndex]);

        path.splice(
            insertIndex + 1,
            0,
            ...cycle.slice(splitIndex + 1),
            ... cycle.slice(0, splitIndex + 1)
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
    [Graph.TYPES.EDGE_LIST]: ({ vertices, edges }) => {
        const verticesObj = vertices.reduce(
            (acc, vertex) => ({ ...acc, [vertex]: 0 }), {}
        );
        edges.forEach(({ vertices }) => {
            vertices.forEach(vertex => { verticesObj[vertex]++; });
        });
        return Object.values(verticesObj).every(count => count % 2 === 0);
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
