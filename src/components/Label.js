import React from 'react';
import { lightOrDark } from "../helpers/utils";

export default function Label({ labels }) {
  return labels.map(label => {
    const background = lightOrDark(label.color);
    const borderClass = label.color === "ffffff" ? "add-border-black" : "";
    return (
      <span className={`github-label ${background} ${borderClass}`} style={{
        backgroundColor: `#${label.color}`
      }}
      >
        {label.name}
      </span>
    )
  });
}
