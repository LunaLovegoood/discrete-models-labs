const Graph = require('labs.graph');
const { first } = require('labs.utils');

const removeElement = (arr, el) => {
    const index = arr.indexOf(el);
    if (index === -1) {
        return;
    }
    arr.splice(index, 1);
};

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

const createEdgePriorityQueue = edges => {
    const edgeQueue = new PriorityQueue();
    edges.forEach(edge => edgeQueue.enqueue(edge, edge.weight));
    return edgeQueue;
};

const kruskal = graph => {
    const mst = Graph.create(Graph.TYPES.EDGE_LIST, Graph.getVertices(graph), []);
    
    const edgeQueue = createEdgePriorityQueue(Graph.getEdges(graph));
    const disjointSet = new DisjointSet(Graph.getVertices(graph));
    
    while(!edgeQueue.isEmpty()) {
        const edge = edgeQueue.dequeue();
    
        if (!disjointSet.areConnected(edge.first, edge.second)) {
            Graph.insert(mst, edge);
            disjointSet.union(edge.first, edge.second);
        }
    }

    return mst;
};

/** @type {(graph: Graph) => Graph} */
const prim = graph => {
    const mst = Graph.create(Graph.TYPES.EDGE_LIST, Graph.getVertices(graph), []);

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
                .filter(edge => !visited.has(edge.second))
        );

        if (adjEdges.isEmpty()) {
            // graph is not connected, so return MST built so far
            return mst;
        }

        const edge = adjEdges.dequeue();
        Graph.insert(mst, edge);
        visited.add(edge.second);
        vertices.delete(edge.second);
    }

    return mst;
};

const getComponent = (graph, vertex, component = [vertex]) => {
    const newVertices = Graph.getAdjacentEdges(graph, vertex)
        .map(edge => edge.other(vertex))
        .filter(vertex => !component.includes(vertex));
    if (newVertices.length === 0) {
        return component;
    }

    return newVertices
        .map(vertex => getComponent(graph, vertex, [...component, ...newVertices]))
        .reduce((acc, el) => [...acc, ...el], [])
        .reduce((acc, el) => acc.includes(el) ? acc : [...acc, el], []);
};

const findComponents = graph => {
    const vertices = Graph.getVertices(graph);
    const components = [];

    while (vertices.length !== 0) {
        const component = getComponent(graph, first(vertices));
        components.push({
            vertices: component,
            cheapestEdge: Graph.createUndirectedEdge(null, null, Infinity)
        });
        component.forEach(vertex => removeElement(vertices, vertex));
    }    

    return components;
};

const boruvka = graph => {
    const mst = Graph.create(Graph.TYPES.EDGE_LIST, Graph.getVertices(graph), []);

    while (true) {
        const components = findComponents(mst);
        if (components.length === 1) {
            break;
        }

        components.forEach(component => {
            component.vertices.forEach(vertex => {
                const adjacent = Graph
                    .getAdjacentEdges(graph, vertex)
                    .filter(edge => !component.vertices.includes(edge.other(vertex)));
                if (adjacent.length === 0) {
                    return;
                }

                const minEdge = adjacent.reduce((min, el) => el.weight < min.weight ? el : min);
                if (minEdge.weight < component.cheapestEdge.weight) {
                    component.cheapestEdge = minEdge;
                }
            });
        });

        components.forEach(({ cheapestEdge }) => {
            const isPresent = Graph.getEdges(mst).some(edge => (
                edge.has(cheapestEdge.vertices[0]) && edge.has(cheapestEdge.vertices[1])
            ));
            if (!isPresent) {
                Graph.insert(mst, cheapestEdge);
            }
        });
    }

    return mst;
};

module.exports = {
    kruskal,
    prim,
    boruvka
};
