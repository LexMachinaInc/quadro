import React from 'react';
import { Query } from "react-apollo";
import { arrayOf, shape } from "prop-types";
import '../App.scss';
import CardContainer from './CardContainer';
import EmptyBoard from "./EmptyBoard";
import { getIssueState, organizeDataIntoStatusBuckets } from "../helpers/utils";
import { GET_BOARD_DATA } from "../helpers/github";
import Loader from "./Loader";

export default function Board( { member }) {
  const handleRefetch = (cb) => (e) => {
    e.preventDefault();
    e.currentTarget.blur();
    cb();
  }
  return (
    <div>
      <Query query={GET_BOARD_DATA} variables={{ member, end: null }} notifyOnNetworkStatusChange>
        {({ loading, error, data, fetchMore, refetch, networkStatus }) => {

          if (loading || networkStatus === 4) return <Loader />;
          if (error) return <EmptyBoard />;

          const { hasNextPage, endCursor} = data.repository.issues.pageInfo;

          if (hasNextPage) {
            fetchMore({
              variables: { member, end: endCursor },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                const updatedNodes = prev.repository.issues.nodes.concat(fetchMoreResult.repository.issues.nodes);
                fetchMoreResult.repository.issues.nodes = updatedNodes;
                return fetchMoreResult;
              }
            })
          }

          const issues = data.repository.issues.nodes.map(
            (issue) => {
              issue.status = getIssueState(issue.labels.nodes);
              return issue;
          });

          if (issues.length) {
            const buckets = organizeDataIntoStatusBuckets(issues);
            return (
              <React.Fragment>
                <section className="lists-container center">
                  {buckets.map((bucket, idx) => (
                    <CardContainer
                      key={Board.statusMap[idx]}
                      title={Board.statusMap[idx]}
                      issues={bucket}
                    />
                  ))}
                </section>
                <div className="refresh-container">
                  <button
                    className="refresh-button"
                    onClick={handleRefetch(refetch)}
                  >
                    Update Board
                  </button>
                </div>
              </React.Fragment>
            )
          }
          return <EmptyBoard />
        }}
      </Query>
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
