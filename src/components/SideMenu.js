import React, { useState } from "react";
import { arrayOf, string, element } from "prop-types";
import { toggleSideMenu, toggleDisplay } from "../helpers/ui";
import { getUserColDisplaySetting, saveUserColDisplaySetting } from "../helpers/user";

export default function SideMenu({ buckets, action }) {
  const userColumnDisplay = getUserColDisplaySetting();
  const initialBucketDisplayState = userColumnDisplay ? userColumnDisplay : buckets.reduce((result, bucket) => {
    result[bucket] = true;
    return result;
  }, {});

  const [bucketDisplay, setBucketDisplay] = useState(initialBucketDisplayState);

  const toggleBucketDisplay = (bucket) => (e) => {
    const updatedBuckets = { ...bucketDisplay, [bucket]: !bucketDisplay[bucket] };
    setBucketDisplay(updatedBuckets);
    toggleDisplay(bucket);
    saveUserColDisplaySetting(updatedBuckets);
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
      <div className="logout-button-container">{action}</div>
    </div>
  )
}

SideMenu.propTypes = {
  buckets: arrayOf(string).isRequired,
  action: element.isRequired,
}