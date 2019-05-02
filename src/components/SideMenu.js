import React, { useState } from "react";
import { arrayOf, string } from "prop-types";
import { toggleSideMenu, toggleDisplay } from "../helpers/ui";

export default function SideMenu({ buckets }) {
  const initialBucketDisplayState = buckets.reduce((result, bucket) => {
    result[bucket] = true;
    return result;
  }, {});
  const [bucketDisplay, setBucketDisplay] = useState(initialBucketDisplayState);

  const toggleBucketDisplay = (bucket) => (e) => {
    const updatedBuckets = { ...bucketDisplay, [bucket]: !bucketDisplay[bucket] };
    setBucketDisplay(updatedBuckets);
    toggleDisplay(bucket);
  }

  return (
    <div id="side-menu" className="column-controls-container">
      <div className="column-controls">
        <button
          className="controls-menu-close-btn"
          onClick={toggleSideMenu}
        >
          x
        </button>
        <p><strong>Columns Displayed</strong></p>
        {buckets.map((bucket) => (
          <label key={bucket}>
            <input
              type="checkbox"
              checked={bucketDisplay[bucket]}
              onChange={toggleBucketDisplay(bucket)}
            />
              {bucket}
            </label>
        ))}
      </div>
    </div>
  )
}

SideMenu.propTypes = {
  buckets: arrayOf(string).isRequired,
}