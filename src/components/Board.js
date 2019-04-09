import React from 'react';
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { arrayOf, shape } from "prop-types";
import '../App.scss';
import CardContainer from './CardContainer';
import EmptyBoard from "./EmptyBoard";
import loader from "../assets/green-loader-icon.gif";
import { getIssueState, organizeDataIntoStatusBuckets } from "../helpers/utils";

const GET_ASSIGNED_ISSUES = (member) => gql`
  query {
    repository(owner: "LexMachinaInc", name:"deus_lex") {
      id,
      name,
      description,
      issues(states:[OPEN], filterBy:{assignee:${member}}, first:100) {
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
      }
    }
  }`;

function hasData(data) {
  return data.some((bucket) => bucket.length > 0);
}

export default function Board( { member }) {
  return (
    <div>
      <section className="lists-container center">
        <Query query={GET_ASSIGNED_ISSUES(member)}>
          {({ loading, error, data }) => {
            if (loading) return <div className="loader-container"><img src={loader}></img></div>
            if (error) return <EmptyBoard />;
            const issues = data.repository.issues.nodes.map((issue) => {
              issue.status = getIssueState(issue.labels.nodes);
              return issue;
            });
            const buckets = organizeDataIntoStatusBuckets(issues);
            return buckets.map((bucket, idx) => (
              <CardContainer
                key={Board.statusMap[idx]}
                title={Board.statusMap[idx]}
                issues={bucket}
              />
            ));
          }}
        </Query>
      </section>
    </div>
  )
}

Board.propTypes = {
  data: arrayOf(shape({})).isRequired,
}

Board.statusMap = {
  0: 'Backlog',
  1: 'Ready',
  2: 'In Progress',
  3: 'Done',
}
