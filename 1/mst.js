const Graph = require('labs.graph');

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
        const mst = Graph.create(Graph.TYPES.EDGE_LIST, []);
    
        const edgeQueue = createEdgePriorityQueue(Graph.getEdges(graph));

        const disjointSet = new DisjointSet(Graph.getVertices(graph));
    
        while(!edgeQueue.isEmpty()) {
            const edge = edgeQueue.dequeue();
    
            if (!disjointSet.areConnected(edge.from, edge.to)) {
                mst.data.push(edge);
                disjointSet.union(edge.from, edge.to);
            }
        }

        return mst;
    };
})(); 

/** @type {(graph: Graph) => Graph} */
const prim = graph => {
    const mst = Graph.create(Graph.TYPES.EDGE_LIST, []);

    const vertices = new Set(Graph.getVertices(graph));
    if (vertices.size === 0) {
        return mst;
    }

    const visited = new Set([[...vertices][0]]);
    vertices.delete([...visited][0]);

    while (vertices.size !== 0) {
        const adjEdges = createEdgePriorityQueue(
            [...visited]
                .map(vertex => Graph.getAdjacentEdges(graph, vertex))
                .reduce((acc, edges) => [...acc, ...edges], [])
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

module.exports = {
    kruskal,
    prim
};
