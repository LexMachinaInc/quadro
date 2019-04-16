/*eslint-disable no-useless-escape */
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import { getToken } from "./authorization";

export function getApolloClient() {
  return new ApolloClient({
    uri: "https://api.github.com/graphql",
    request: async operation => {
      const token = await getToken();
      if (token) {
        operation.setContext({
          headers: {
            authorization: `Bearer ${token}`
          }
        });
      }
    }
  });
}

export const DASHBOARD_DATA = gql`
  query {
    viewer {
      avatarUrl
      login
    }
    repository(owner: "LexMachinaInc", name:"deus_lex") {
      assignableUsers(first:100) {
        nodes {
          login
        }
      }
    }
  }`;

function queryStringBuilder(view, member, labels, state) {
  const user = CONFIG.owner;
  const repo = CONFIG.repo;
  let query = `user:${user} repo:${repo} sort:updated-desc state:${state}`;
  if (view === "member") {
    query = query + ` assignee:${member}`;
  }
  if (labels) {
    query = `${query} ${labels}`;
  }
  return query;
}

export const GET_BUCKET = gql`
  query board($queryStr: String!, $end: String) {
    search(first:10, type:ISSUE, query:$queryStr, after: $end) {
      issueCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ... on PullRequest {
            labels(first: 10) {
              nodes {
                name
                color
              }
            }
            title
            number
            url
            assignees(first: 10) {
              edges {
                node {
                  login
                  avatarUrl
                }
              }
            }
          }
        }
      }
      edges {
        node {
          ... on Issue {
            labels(first: 10) {
              nodes {
                name
                color
              }
            }
            number
            title
            url
            assignees(first: 10) {
              edges {
                node {
                  login
                  avatarUrl
                }
              }
            }
          }
        }
      }
    }
  }
`

export const CONFIG = {
  owner: "LexMachinaInc",
  repo: "deus_lex",
  buckets: [
    {title: "Backlog", key: "backlog" },
    {title: "Ready", key: "ready" },
    {title: "In Progress", key: "progress" },
    {title: "Done", key: "done" },
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
        progress: `label:\"2 - Working\"`,
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

export function getQueryString(member, bucket) {
  const view = Object.keys(CONFIG.meetings).includes(member) ? "meeting" : "member";
  const state = bucket === "closed" ? "closed" : "open";
  const bucketLabels = CONFIG.queries.buckets.labels[bucket];
  const labels = view === "meeting" ?
    `${bucketLabels} ${CONFIG.queries.meetings[member].labels}` :
    bucketLabels;
  return queryStringBuilder(view, member, labels, state);
}
