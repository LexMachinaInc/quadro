import React from 'react';
import { Query } from "react-apollo";
import { arrayOf, shape } from "prop-types";
import '../App.scss';
import CardContainer from './CardContainer';
import EmptyBoard from "./EmptyBoard";
import loader from "../assets/green-loader-icon.gif";
import { getIssueState, organizeDataIntoStatusBuckets } from "../helpers/utils";
import { GET_BOARD_DATA } from "../helpers/github";
import LoadMoreButton from './LoadMoreButton';

function hasData(data) {
  return data.some((bucket) => bucket.length > 0);
}

export default function Board( { member }) {
  return (
    <div>
      <Query query={GET_BOARD_DATA} variables={{ member, end: null }}>
        {({ loading, error, data, fetchMore }) => {
          if (loading) {
            return (
              <div className="loader-container">
                <img src={loader}></img>
              </div>
            )
          }

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
            const { hasNextPage, endCursor  } = data.repository.issues.pageInfo;
            return (
              <React.Fragment>
                <section className={`lists-container center ${hasNextPage ? "accomodate-load-more" : ""}`}>
                  {buckets.map((bucket, idx) => (
                    <CardContainer
                      key={Board.statusMap[idx]}
                      title={Board.statusMap[idx]}
                      issues={bucket}
                    />
                  ))}
                </section>
                {/* {hasNextPage ? (
                  <LoadMoreButton
                    onLoadMore={() => fetchMore({
                      variables: { member, end: endCursor },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        const updatedNodes = prev.repository.issues.nodes.concat(fetchMoreResult.repository.issues.nodes);
                        fetchMoreResult.repository.issues.nodes = updatedNodes;
                        return fetchMoreResult;
                      }
                    })}
                  />
                ) : null} */}
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
