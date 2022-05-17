const CONFIG = {
  api: {
    github: {
      rest: "https://api.github.com",
      gql: "https://api.github.com/graphql",
    }
  },
  owner: "LexMachinaInc",
  repo: "deus_lex",
  buckets: [
    {title: "Backlog", key: "backlog", label: "0 - Backlog" },
    {title: "Ready", key: "ready", label: "1 - Ready" },
    {title: "Working", key: "working", label: "2 - Working" },
    {title: "Done", key: "done", label: "3 - Done" },
    {title: "Closed", key: "closed" },
  ],
  meetings: {
    design: "DESIGN MEETING",
    development: "DEVELOPMENT MEETING",
    frontend: "FRONTEND TEAM MEETING",
    fullstack: "FULL-STACK MEETING",
    nlp: "NLP MEETING",
  },
  queries: {
    buckets: {
      labels: {
        backlog: `-label:\"1 - Ready\" -label:\"2 - Working\" -label:\"3 - Done\" -label:\"[zube]: Ready\" -label:\"[zube]: In Progress\" -label:\"[zube]: Done\"`,
        ready: `label:\"1 - Ready\"`,
        working: `label:\"2 - Working\"`,
        done: `label:\"3 - Done\"`,
      }
    },
    meetings: {
      design: {
        labels: `label:\"Design Meeting\"`
      },
      development: {
        labels: `label:\"Development Meeting\"`
      },
      frontend: {
        labels: `label:\"Front End Team Meeting\"`
      },
      fullstack: {
        labels: `label:\"Full-Stack Meeting\"`
      },
      nlp: {
        labels: `label:\"NLP Meeting\"`
      }
    }
  }
};

export default CONFIG;