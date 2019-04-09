import React from 'react';
import { Query } from "react-apollo";
import { arrayOf, shape } from "prop-types";
import '../App.scss';
import CardContainer from './CardContainer';
import EmptyBoard from "./EmptyBoard";
import loader from "../assets/green-loader-icon.gif";
import { getIssueState, organizeDataIntoStatusBuckets } from "../helpers/utils";
import { GET_BOARD_DATA } from "../helpers/github";

function hasData(data) {
  return data.some((bucket) => bucket.length > 0);
}

export default function Board( { member }) {
  return (
    <div>
      <section className="lists-container center">
        <Query query={GET_BOARD_DATA} variables={{ member }}>
          {({ loading, error, data }) => {
            if (loading) {
              return (
                <div className="loader-container">
                  <img src={loader}></img>
                </div>
              )
            }

            if (error) return <EmptyBoard />;

            const issues = data.repository.issues.nodes.map(
              (issue) => {
                issue.status = getIssueState(issue.labels.nodes);
                return issue;
            });

            if (issues.length) {
              const buckets = organizeDataIntoStatusBuckets(issues);
              return buckets.map((bucket, idx) => (
                <CardContainer
                  key={Board.statusMap[idx]}
                  title={Board.statusMap[idx]}
                  issues={bucket}
                />
              ));
            }
            return <EmptyBoard />
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
