import React from 'react';
import { lightOrDark, WAFFLE_LABELS } from "../helpers/utils";
import { removeZube } from "../helpers/ui";

export default function Label({ labels }) {
  return labels.map(label => {
    const background = lightOrDark(label.color);
    const borderClass = label.color === "ffffff" ? "add-border-black" : "";
    const statusLabel = WAFFLE_LABELS.has(label.name) ? "status-label" : "";
    const name = removeZube(label.name);
    return (
      <span key={label.name} className={`github-label ${background} ${borderClass} ${statusLabel}`} style={{
        backgroundColor: `#${label.color}`
      }}
      >
        {name}
      </span>
    )
  });
}
