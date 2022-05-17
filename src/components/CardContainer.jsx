import React, { useState } from "react";
import { string, shape, arrayOf } from "prop-types";
import { Query, Mutation } from "react-apollo";
import "../App.scss";
import Card from "./Card";
import Loader from "./Loader";
import EmptyBoard from "./EmptyBoard";
import {
  UPDATE_GITHUB_ISSUE,
  updateIssueInCache,
} from "../helpers/api_interface";
import { handleOnDrop } from "../helpers/ui";

export default function CardContainer({
  title,
  query,
  queryString,
  statusLabelId,
  allQueryStrings,
  allStatusLabels,
}) {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = (nextPage, fetchMore) => (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (!isFetching && nextPage && scrollHeight - scrollTop === clientHeight) {
      setIsFetching(true);
      fetchMore();
    }
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (statusLabelId, allStatusLabels, updateIssue) => (e) =>
    handleOnDrop(e, statusLabelId, allStatusLabels, updateIssue);

  const showColumnOnLoad = (key, bucket) => {
    const colDisplaySetting = localStorage.getItem(key);
    if (colDisplaySetting) {
      const settings = JSON.parse(colDisplaySetting);
      return settings[bucket];
    }
    return true;
  };

  return (
    <div
      id={title}
      className={`list ${
        !showColumnOnLoad("quadroUserColDisplay", title) ? "js-hide" : ""
      }`}
    >
      <h3 className="list-title">{title}</h3>
      <Query query={query} variables={{ queryStr: queryString, end: null }}>
        {({ loading, error, data, fetchMore }) => {
          if (loading) return <Loader />;
          if (error) return <EmptyBoard />;
          const { hasNextPage, endCursor } = data.search.pageInfo;
          const issues = data.search.edges.map((edge) => {
            const {
              number,
              url,
              title,
              labels,
              assignees,
              id,
              __typename: typeName,
            } = edge.node;
            return {
              id,
              number,
              url,
              title,
              labels: labels.nodes,
              assignees: assignees.edges,
              typeName,
            };
          });

          return (
            <Mutation
              mutation={UPDATE_GITHUB_ISSUE}
              update={(cache, { data, data: { updateIssue } }) => {
                Object.keys(allQueryStrings).forEach((qs) => {
                  const queryCache = cache.readQuery({
                    query,
                    variables: { queryStr: allQueryStrings[qs], end: null },
                  });
                  queryCache.search.edges = queryCache.search.edges.filter(
                    (edge) => edge.node.id !== updateIssue.node_id,
                  );
                });

                const q = cache.readQuery({
                  query,
                  variables: { queryStr: queryString, end: null },
                });
                q.search.edges = [
                  { node: updateIssueInCache(updateIssue) },
                  ...q.search.edges,
                ];
              }}
            >
              {(updateGithubIssue, { loading }) => {
                if (loading) return <Loader />;
                const fetchMoreProps = {
                  variables: { queryStr: queryString, end: endCursor },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    setIsFetching(false);
                    if (!fetchMoreResult) return prev;
                    const updatedEdges = prev.search.edges.concat(
                      fetchMoreResult.search.edges,
                    );
                    fetchMoreResult.search.edges = updatedEdges;
                    return fetchMoreResult;
                  },
                };

                const handleFetchMore = () => fetchMore(fetchMoreProps);

                return (
                  <ul
                    id={title}
                    className="list-items"
                    onScroll={handleScroll(hasNextPage, handleFetchMore)}
                    onTouchMove={handleScroll(hasNextPage, handleFetchMore)}
                    onDragOver={onDragOver}
                    onDrop={onDrop(
                      statusLabelId,
                      allStatusLabels,
                      updateGithubIssue,
                    )}
                  >
                    {issues.map((issue) => (
                      <li key={issue.number}>
                        <Card
                          key={issue.number}
                          issue={issue}
                          originStatusLabelId={statusLabelId}
                        />
                      </li>
                    ))}
                    {isFetching && (
                      <div className="loading-more">
                        Loading more issues ...
                      </div>
                    )}
                  </ul>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    </div>
  );
}

CardContainer.defaultProps = {
  statusLabelId: null,
};

CardContainer.propTypes = {
  title: string.isRequired,
  query: shape({}).isRequired,
  queryString: string.isRequired,
  allQueryStrings: shape({}).isRequired,
  statusLabelId: string,
  allStatusLabels: arrayOf(shape({})).isRequired,
};
