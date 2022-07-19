import React from "react";
import { lightOrDark, WAFFLE_LABELS } from "../helpers/utils";
import { removeZube } from "../helpers/ui";
import { getUserHideStatusLabelSetting } from "../helpers/user";

export default function Label({ labels }) {
  const userHideStatusLabels = getUserHideStatusLabelSetting();
  return labels.map((label) => {
    const background = lightOrDark(label.color);
    const borderClass = label.color === "ffffff" ? "add-border-black" : "";
    const statusLabel = WAFFLE_LABELS.has(label.name) ? "status-label" : "";
    const hideLabel = statusLabel && userHideStatusLabels;
    const name = removeZube(label.name);
    return (
      <span
        key={label.name}
        className={`github-label ${background} ${borderClass} ${statusLabel} ${
          hideLabel ? "js-hide" : ""
        }`}
        style={{
          backgroundColor: `#${label.color}`,
        }}
      >
        {name}
      </span>
    );
  });
}
