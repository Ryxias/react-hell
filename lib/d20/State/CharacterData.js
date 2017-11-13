'use strict';

const model = require('./CharacterDataModel').model;

class CharacterData {
  constructor(data) {
    this.data = data;

    // A snapshot of the Character Data Model
    this.model = {};

    // A map of edges; the keys map to arrays of additional keys
    this.effect_graph = {};

    this.registerDataModel(model);
  }

  getParameter(parameter) {
    return this.data[parameter];
  }

  setParameter(parameter, value) {
    const old_value = this.data[parameter] || -9999;
    if (old_value !== value) {
      this.recalculation_queue = [];
      this.data[parameter] = value;
      this.triggerValueChange(parameter);
    }
  }

  registerDataModel(model) {
    this.model = model;
    this.effect_graph = {};

    // Build the effect_graph
    Object.keys(this.model).forEach(parameter => {
      const { dependencies } = this.model[parameter];
      dependencies.forEach(dependency => {
        this.effect_graph[dependency] = this.effect_graph[dependency] || [];
        this.effect_graph[dependency].push(parameter);
      });
    });
  }

  triggerValueChange(parameter) {
    const recalculation_queue = [];
    const expansion_queue = [ parameter ];

    // Using the effect graph we need to slice out a subset of relevant entries
    const forward_edges = []; // Array of tuples
    buildRelevantGraph(parameter, this.effect_graph, forward_edges);

    // We use DFS with cycle detection
    function buildRelevantGraph(subject, graph, forward_edges) {
      const dependees = graph[subject] || [];

      forward_edges.push([subject, dependees]);

      dependees.forEach(dependee => {
        buildRelevantGraph(dependee, graph, forward_edges);
      });
    }
    const graph = {
      edges: forward_edges,
      getEdgesStartingWith()
    };

    /**
     * From wikipedia: https://en.wikipedia.org/wiki/Topological_sorting
     */
    function topologicalSort(L, S, forward_edges) {
      while (S.length > 0) {
        const n = S.shift();
        L.push(n);
        graph[n].forEach(m => {
          const idxOf = graph[n].indexOf(m);
          graph[n].splice(idxOf, 1);
        });
      }
    }

    function recursiveBuildRecalculationQueue(parameter, queue) {
      const effects = this.effect_graph[parameter];
      effects.forEach(dependee => {
        if (queue.includes(dependee)) {
          throw new Error('Cycle detected in CharacterData dependency resolution');
        }
        queue.push(dependee);
      });
    }
  }

  serialize() {
    return JSON.stringify(this.data);
  }


  unserialize(json_string) {
    this.data = JSON.parse(json_string);
  }
}

module.exports = CharacterData;
