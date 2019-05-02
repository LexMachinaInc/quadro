import React , { useState } from "react";
import { string, shape } from "prop-types";
import "../App.scss";
import Card from "./Card";
import { Query, Mutation } from "react-apollo";
import Loader from "./Loader";
import EmptyBoard from "./EmptyBoard";
import { UPDATE_ISSUE } from "../helpers/github";

export default function CardContainer({ title, query, queryString, statusLabelId, allQueryStrings }) {

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
    if (statusLabelId === originStatusLabelId) {
      return;
    }

    const updatedLabelsIds = labelIds.filter((id) => id !== originStatusLabelId);

    // Moving card into Closed bucket
    if (!statusLabelId) {
      updateIssue({ variables: { id: issueId, labelIds: updatedLabelsIds, state: "CLOSED" }})
    } else {
      updatedLabelsIds.push(statusLabelId);
      updateIssue({ variables: { id: issueId, labelIds: updatedLabelsIds, state: "OPEN" }});
    }
  };

  return (
    <div id={title} className="list">
      <h3 className="list-title">{title}</h3>
      <Query query={query} variables={{ queryStr: queryString, end: null }}>
        {({ loading, error, data, fetchMore }) => {
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
            <Mutation
              mutation={UPDATE_ISSUE}
              update={(cache, { data: { updateIssue: { issue } } }) => {
                Object.keys(allQueryStrings).forEach((qs) => {
                  const queryCache = cache.readQuery({ query, variables: { queryStr: allQueryStrings[qs], end: null } });
                  queryCache.search.edges = queryCache.search.edges.filter((edge) => edge.node.id !== issue.id)
                });

                const q = cache.readQuery({ query, variables: { queryStr: queryString, end: null } });
                q.search.edges = [{node: { ...issue }}, ...q.search.edges];
              }}
            >
              {(updateIssue, { loading }) => {
                if (loading) return <Loader />;
                const fetchMoreProps = {
                  variables: { queryStr: queryString, end: endCursor },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    setIsFetching(false);
                    if (!fetchMoreResult) return prev;
                    const updatedEdges = prev.search.edges.concat(fetchMoreResult.search.edges);
                    fetchMoreResult.search.edges = updatedEdges;
                    return fetchMoreResult;
                  }
                };

                const handleFetchMore = () => fetchMore(fetchMoreProps);

                return (
                  <ul
                    id={title}
                    className="list-items"
                    onScroll={handleScroll(hasNextPage, handleFetchMore)}
                    onTouchMove={handleScroll(hasNextPage, handleFetchMore)}
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
                )
              }}
            </Mutation>
          )
        }}
      </Query>
    </div>
  );
}

CardContainer.defaultProps = {
  statusLabelId: null,
}

CardContainer.propTypes = {
  title: string.isRequired,
  query: shape({}).isRequired,
  queryString: string.isRequired,
  allQueryStrings: shape({}).isRequired,
  statusLabelId: string,
};
