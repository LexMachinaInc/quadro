import React , { useState } from 'react';
import { string, shape } from 'prop-types';
import '../App.scss';
import Card from './Card';
import { Query, Mutation } from "react-apollo";
import Loader from "./Loader";
import EmptyBoard from "./EmptyBoard";
import { UPDATE_ISSUE_LABELS } from "../helpers/github";

export default function CardContainer({ title, member, query, queryString, statusLabelId }) {

  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = (nextPage, fetchMore) => (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (!isFetching && nextPage && (scrollHeight - scrollTop) === clientHeight) {
      setIsFetching(true);
      fetchMore();
    }
  }

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (statusLabelId, updateIssue) => (e) => {
    const {issueId, originStatusLabelId, labelIds } = JSON.parse(e.dataTransfer.getData("text/plain"));
    console.log("NEW STATUS LABEL ID", statusLabelId);
    console.log("OLD STATUS LABEL ID", originStatusLabelId)
    console.log("CURRENT LABELS", labelIds);
    const updatedLabelsIds = labelIds.filter((id) => id !== originStatusLabelId);
    updatedLabelsIds.push(statusLabelId);
    console.log("UPDATED LABELS", updatedLabelsIds);
    updateIssue({ variables: { id: issueId, labelIds: updatedLabelsIds }});
  };

  return (
    <div className="list">
      <h3 className="list-title">{title}</h3>
      <Query query={query} variables={{ queryStr: queryString, end: null }}>
        {({ loading, error, data, fetchMore}) => {
          if (loading) return <Loader />;
          if (error) return <EmptyBoard />;
          const { hasNextPage, endCursor} = data.search.pageInfo;
          const issues = data.search.edges
            .map((edge) => {
              const { number, url, title, labels, assignees, id } = edge.node;
              return {
                id,
                number,
                url,
                title,
                labels: labels.nodes,
                assignees: assignees.edges
              }
            });

          return (
            <Mutation mutation={UPDATE_ISSUE_LABELS}>
              {(updateIssue) => (
                <ul
                  id={title}
                  className="list-items"
                  onScroll={handleScroll(hasNextPage, () => {
                    return fetchMore({
                      variables: { queryStr: queryString, end: endCursor },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        setIsFetching(false);
                        if (!fetchMoreResult) return prev;
                        const updatedEdges = prev.search.edges.concat(fetchMoreResult.search.edges);
                        fetchMoreResult.search.edges = updatedEdges;
                        return fetchMoreResult;
                      }
                    })
                  })}
                  onTouchMove={handleScroll(hasNextPage, () => {
                    return fetchMore({
                      variables: { queryStr: queryString, end: endCursor },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        setIsFetching(false);
                        if (!fetchMoreResult) return prev;
                        const updatedEdges = prev.search.edges.concat(fetchMoreResult.search.edges);
                        fetchMoreResult.search.edges = updatedEdges;
                        return fetchMoreResult;
                      }
                    })
                  })}
                  onDragOver={onDragOver}
                  onDrop={onDrop(statusLabelId, updateIssue)}
                >
                  {issues.map(issue => (
                    <li key={issue.number}>
                      <Card key={issue.number} issue={issue} originStatusLabelId={statusLabelId} />
                    </li>
                  ))}
                  {isFetching && <div className="loading-more">Loading more issues ...</div>}
                </ul>
              )}
            </Mutation>
          )
        }}
      </Query>
    </div>
  );
}

CardContainer.propTypes = {
  title: string.isRequired,
  query: shape({}).isRequired,
  queryString: string.isRequired,
  member: string.isRequired,
};
