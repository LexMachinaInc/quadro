import React , { useState } from 'react';
import { string, shape } from 'prop-types';
import '../App.scss';
import Card from './Card';
import { Query } from "react-apollo";
import Loader from "./Loader";
import EmptyBoard from "./EmptyBoard";

export default function CardContainer({ title, member, query, queryString }) {

  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = (nextPage, fetchMore) => (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (!isFetching && nextPage && (scrollHeight - scrollTop) === clientHeight) {
      setIsFetching(true);
      fetchMore();
    }
  }

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (bucket) => (e) => {
    const {issueNumber, originBucket } = JSON.parse(e.dataTransfer.getData("text/plain"));
    console.log(`Adding issue #${issueNumber} to ${bucket} from ${originBucket}`);
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
              const { number, url, title, labels, assignees } = edge.node;
              return {
                number: number,
                url: url,
                title: title,
                labels: labels.nodes,
                assignees: assignees.edges,
              }
            });

          return (
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
              onDrop={onDrop(title)}
            >
              {issues.map(issue => (
                <li key={issue.number}>
                  <Card key={issue.number} issue={issue} originBucket={title} />
                </li>
              ))}
              {isFetching && <div className="loading-more">Loading more issues ...</div>}
            </ul>
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
