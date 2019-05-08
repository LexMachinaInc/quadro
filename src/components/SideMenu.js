import React, { useState, useEffect } from "react";
import { arrayOf, string } from "prop-types";
import { toggleSideMenu, toggleDisplay } from "../helpers/ui";

function saveUserColDisplaySetting(key, buckets) {
  console.log("SAVING", JSON.stringify(buckets));
  localStorage.setItem(key, JSON.stringify(buckets));
}

function getUserColDisplaySetting(key) {
  const colDisplaySetting = localStorage.getItem(key);
  return colDisplaySetting ? JSON.parse(colDisplaySetting) : null;
}

export default function SideMenu({ buckets }) {
  const userColumnDisplay = getUserColDisplaySetting("quadroUserColDisplay");
  const initialBucketDisplayState = userColumnDisplay ? userColumnDisplay : buckets.reduce((result, bucket) => {
    result[bucket] = true;
    return result;
  }, {});

  const [bucketDisplay, setBucketDisplay] = useState(initialBucketDisplayState);

  const toggleBucketDisplay = (bucket) => (e) => {
    const updatedBuckets = { ...bucketDisplay, [bucket]: !bucketDisplay[bucket] };
    setBucketDisplay(updatedBuckets);
    toggleDisplay(bucket);
    saveUserColDisplaySetting("quadroUserColDisplay", updatedBuckets);
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