const types = {
    WEIGHT_MATRIX: Symbol('WeightMatrix'),
    EDGE_LIST: Symbol('EdgeList')
};

/**
 * @typedef {object} Graph
 * @property {symbol} type
 * @property {any} data
 */

/**
 * @typedef {object} Edge
 * @property {string} from
 * @property {string} to
 * @property {number} weight
 */

/** @type {(type: string, data: any) => Graph} */
const createGraph = (type, data) => ({ type, data });

/** @type {(from: string, to: string, weight: number) => Edge} */
const createEdge = (from, to, weight) => ({ from, to, weight });

/** @type {(impl: object) => (graph: Graph, ...args: any[]) => any} */
const defineGraphFunction = impl => (graph, ...args) => {
    if (!Reflect.has(impl, graph.type)) {
        throw new Error(
            `Missing implementation for graph type "${graph.type.description}".`
        );
    }
    return impl[graph.type](graph.data, ...args)
};

/** @type {(graph: Graph) => void} */
const print = defineGraphFunction({
    [types.WEIGHT_MATRIX]: ({ vertices, weightMatrix }) => {
        const alignment = 3;
        console.log(`  ${vertices.map(vertex => vertex.padStart(alignment)).join('  ')}`);
        weightMatrix.forEach((row, i) => {
            console.log(`${vertices[i]} ${
                row.map(weight => String(weight).padStart(alignment)).join('  ')
            }`);
        });
    },
    [types.EDGE_LIST]: edgeList => {
        edgeList.forEach(edge => {
            console.log(`${edge.from} -> ${edge.to} (${edge.weight})`);
        });
    }
});

/** @type {(graph: Graph) => Edge[]} */
const getEdges = defineGraphFunction({
    [types.WEIGHT_MATRIX]: ({ vertices, weightMatrix }) => {
        const edges = [];
        weightMatrix.forEach((row, i) => {
            const from = vertices[i];
            row.forEach((weight, j) => {
                if (weight === 0) {
                    return;
                }
                const to = vertices[j];
                edges.push(createEdge(from, to, weight));
            });
        });
        return edges;
    }
});

/** @type {(graph: Graph) => string[]} */
const getVertices = defineGraphFunction({
    [types.WEIGHT_MATRIX]: ({ vertices}) => vertices.slice()
});

/** @type {(graph: Graph, targetVertex: string) => Edge[]} */
const getAdjacentEdges = defineGraphFunction({
    [types.WEIGHT_MATRIX]: ({ vertices, weightMatrix }, targetVertex) => {
        const vertexIndex = vertices.indexOf(targetVertex);
        return weightMatrix[vertexIndex]
            .map((weight, j) => {
                if (weight === 0) {
                    return null;
                }
                return createEdge(targetVertex, vertices[j], weight);
            })
            .filter(edge => edge !== null);
    }
});

class PriorityQueue {
    constructor() {
        this._elements = [];
    }

    enqueue(element, priority) {
        let isInserted = false;
        for (let i = 0; i < this._elements.length; ++i) {
            if (priority < this._elements[i].priority) {
                this._elements.splice(i, 0, { element, priority });
                isInserted = true;
                break;
            }
        }
        if (!isInserted) {
            // if has the highest priority
            this._elements.push({ element, priority });
        }
    }

    dequeue() {
        if (this.isEmpty()) {
            return;
        }
        return this._elements.shift().element;
    }

    isEmpty() {
        return this._elements.length === 0;
    }
}

/** @type {(edges: Edge[]) => PriorityQueue} */
const createEdgePriorityQueue = edges => {
    const edgeQueue = new PriorityQueue();
    edges.forEach(edge => edgeQueue.enqueue(edge, edge.weight));
    return edgeQueue;
};

/** @type {(graph: Graph) => Graph} */
const kruskal = (() => {
    class DisjointSet {
        constructor(elements) {
            this._parent = {};
            elements.forEach(el => { this._parent[el] = el; });
        }

        union(a, b) {
            let rootA = this.find(a);
            let rootB = this.find(b);
      
            if (rootA === rootB) return;

            if (rootA < rootB) {
               if (this._parent[b] != b) {
                   this.union(this._parent[b], a);
               }
               this._parent[b] = this._parent[a];
            }
            else {
               if (this._parent[a] != a) {
                   this.union(this._parent[a], b);
               }
               this._parent[a] = this._parent[b];
            }
        }

        find(a) {
            while (this._parent[a] !== a) {
                a = this._parent[a];
            }
            return a;
        }

        areConnected(a, b) {
            return this.find(a) === this.find(b);
        }
    }

    return graph => {
        const MST = createGraph(types.EDGE_LIST, []);
    
        const edgeQueue = createEdgePriorityQueue(getEdges(graph));

        const disjointSet = new DisjointSet(getVertices(graph));
    
        while(!edgeQueue.isEmpty()) {
            const edge = edgeQueue.dequeue();
    
            if (!disjointSet.areConnected(edge.from, edge.to)) {
                MST.data.push(edge);
                disjointSet.union(edge.from, edge.to);
            }
        }

        return MST;
    };
})(); 

/** @type {(graph: Graph) => Graph} */
const prim = graph => {
    const mst = createGraph(types.EDGE_LIST, []);

    const vertices = new Set(getVertices(graph));
    if (vertices.size === 0) {
        return mst;
    }

    const visited = new Set([[...vertices][0]]);
    vertices.delete([...visited][0]);

    while (vertices.size !== 0) {
        const adjEdges = createEdgePriorityQueue(
            [...visited]
                .map(vertex => getAdjacentEdges(graph, vertex))
                .flat()
                .filter(edge => !visited.has(edge.to))
        );

        if (adjEdges.isEmpty()) {
            // graph is not connected, so return MST built so far
            return mst;
        }

        const edge = adjEdges.dequeue();
        mst.data.push(edge);
        visited.add(edge.to);
        vertices.delete(edge.to);
    }

    return mst;
};

const MST = {
    kruskal,
    prim
};

module.exports = {
    types,
    create: createGraph,
    print,
    MST
};
