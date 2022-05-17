import React, { useState } from "react";
import { arrayOf, string, element } from "prop-types";
import { toggleSideMenu, toggleDisplay, toggleStatusLabels } from "../helpers/ui";
import {
  getUserColDisplaySetting,
  saveUserColDisplaySetting,
  getUserHideStatusLabelSetting,
  saveUserHideStatusLabelSetting,
} from "../helpers/user";

export default function SideMenu({ buckets, action }) {
  const userColumnDisplay = getUserColDisplaySetting();
  const userHideStatusLabels = getUserHideStatusLabelSetting();
  const initialBucketDisplayState = userColumnDisplay ? userColumnDisplay : buckets.reduce((result, bucket) => {
    result[bucket] = true;
    return result;
  }, {});

  const [bucketDisplay, setBucketDisplay] = useState(initialBucketDisplayState);
  const [statusLabelDisplay, setStatusLabelDisplay] = useState(userHideStatusLabels);

  const toggleBucketDisplay = (bucket) => (e) => {
    const updatedBuckets = { ...bucketDisplay, [bucket]: !bucketDisplay[bucket] };
    setBucketDisplay(updatedBuckets);
    toggleDisplay(bucket);
    saveUserColDisplaySetting(updatedBuckets);
  };

  const toggleHideStatusLabelDisplay = (e) => {
    const { checked } = e.target;
    setStatusLabelDisplay(checked);
    toggleStatusLabels(checked);
    saveUserHideStatusLabelSetting(checked);
  };

  return (
    <div id="side-menu" className="column-controls-container">
      <div className="column-controls">
        <button
          type="button"
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
      <div className="column-controls checkbox">
        <input type="checkbox" checked={statusLabelDisplay} onChange={toggleHideStatusLabelDisplay} />
        <span>Hide Status Labels</span>
      </div>
      <div className="logout-button-container">{action}</div>
    </div>
  );
};

SideMenu.propTypes = {
  buckets: arrayOf(string).isRequired,
  action: element.isRequired,
};