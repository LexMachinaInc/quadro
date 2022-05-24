import gql from "graphql-tag";
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable,
  HttpLink,
} from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import { getToken } from "./authorization";
import CONFIG from "../config/api";

export function getApolloClient(token) {
  const request = async (operation) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };

  const cache = new InMemoryCache();

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      }),
  );

  const restLink = new RestLink({ uri: CONFIG.api.github.rest });

  return new ApolloClient({
    link: ApolloLink.from([
      requestLink,
      restLink,
      new HttpLink({
        uri: CONFIG.api.github.gql,
      }),
    ]),
    cache,
  });
}

export const DASHBOARD_DATA = gql`
  query Dashboard($owner: String!, $repo: String!) {
    viewer {
      avatarUrl
      login
    }
    repository(owner: $owner, name: $repo) {
      assignableUsers(first: 100) {
        nodes {
          login
        }
      }
      labels(first: 4) {
        nodes {
          name
          id
        }
      }
    }
  }
`;

function queryStringBuilder(view, member, labels, state) {
  const { owner, repo } = CONFIG;
  let query = `user:${owner} repo:${repo} sort:updated-desc state:${state}`;
  if (view === "member") {
    query += ` assignee:${member}`;
  }
  if (labels) {
    query = `${query} ${labels}`;
  }
  return query;
}

export const GET_BACKLOG = (member, bucket) => {
  const queryStr = getQueryString(member, bucket);
  return GET_BUCKET(queryStr);
};

export const GET_BUCKET = gql`
  query board($queryStr: String!, $end: String) {
    search(first: 30, type: ISSUE, query: $queryStr, after: $end) {
      issueCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ... on PullRequest {
            id
            labels(first: 10) {
              nodes {
                name
                color
                id
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
            id
            labels(first: 10) {
              nodes {
                name
                color
                id
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
`;

export const UPDATE_GITHUB_ISSUE = gql`
  mutation updateIssue(
    $owner: String!
    $repo: String!
    $issue: String!
    $state: String!
    $labels: [String!]
  ) {
    updateIssue(
      input: { state: $state, labels: $labels }
      owner: $owner
      repo: $repo
      issue: $issue
    )
      @rest(
        type: "PullRequest"
        path: "/repos/{args.owner}/{args.repo}/issues/{args.issue}"
        method: "PATCH"
      ) {
      node_id
      labels
      number
      title
      html_url
      assignees
    }
  }
`;

export const UPDATE_ISSUE = gql`
  mutation UpdateIssueLabels($id: ID!, $labelIds: [ID!], $state: IssueState) {
    updateIssue(input: { id: $id, labelIds: $labelIds, state: $state }) {
      issue {
        id
        labels(first: 10) {
          nodes {
            name
            color
            id
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
`;

export function getQueryString(member, bucket) {
  const view = Object.keys(CONFIG.meetings).includes(member)
    ? "meeting"
    : "member";
  const state = bucket === "closed" ? "closed" : "open";
  const bucketLabels = CONFIG.queries.buckets.labels[bucket];
  const labels =
    view === "meeting"
      ? `${bucketLabels} ${CONFIG.queries.meetings[member].labels}`
      : bucketLabels;
  return queryStringBuilder(view, member, labels, state);
}

export function updateIssueInCache(updatedIssue) {
  return {
    id: updatedIssue.node_id,
    number: updatedIssue.number,
    title: updatedIssue.title,
    url: updatedIssue.html_url,
    assignees: {
      edges: updatedIssue.assignees.map((assignee) => ({
        node: {
          login: assignee.login,
          avatarUrl: assignee.avatar_url,
        },
      })),
    },
    labels: {
      nodes: updatedIssue.labels.map((label) => ({
        color: label.color,
        id: label.node_id,
        name: label.name,
      })),
    },
  };
}
