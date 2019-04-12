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

export const BACKLOG_QUERY_STRING = (member) => `user:LexMachinaInc repo:deus_lex assignee:${member} is:issue state:open -label:\"1 - Ready\" -label:\"2 - Working\" -label:\"3 - Done\" -label:\"[zube]: Ready\" -label:\"[zube]: In Progress\" -label:\"[zube]: Done\" sort:updated-desc`;
export const READY_QUERY_STRING = (member) => `user:LexMachinaInc repo:deus_lex assignee:${member} is:issue state:open label:\"1 - Ready\" sort:updated-desc`;
export const PROGRESS_QUERY_STRING = (member) => `user:LexMachinaInc repo:deus_lex assignee:${member} is:issue state:open label:\"2 - Working\" sort:updated-desc`;
export const DONE_QUERY_STRING = (member) => `user:LexMachinaInc repo:deus_lex assignee:${member} is:issue state:open label:\"3 - Done\" sort:updated-desc`;
export const CLOSED_QUERY_STRING = (member) => `user:LexMachinaInc repo:deus_lex assignee:${member} is:issue state:closed sort:updated-desc`;

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
