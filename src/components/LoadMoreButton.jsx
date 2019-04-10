import React from "react";

export default function LoadMoreButton( { onLoadMore }) {
  const handleLoadMore = () => onLoadMore();
  return (
    <div className="load-more-container">
      <button
        onClick={handleLoadMore}
        className="load-more-btn"
      >
        Load More
      </button>
    </div>
  );
}