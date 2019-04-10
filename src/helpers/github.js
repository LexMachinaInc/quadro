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

export const GET_BOARD_DATA = gql`
  query board($member: String!, $end: String) {
    repository(owner: "LexMachinaInc", name:"deus_lex") {
      issues(states:[OPEN], filterBy:{assignee: $member}, first:50, after: $end) {
        nodes {
          assignees(first:10) {
            edges {
              node {
                login
                avatarUrl
              }
            }
          }
          number
          title
          url
          labels(first:10) {
            nodes {
              name
              color
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }`;
