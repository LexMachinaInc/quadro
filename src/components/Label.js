import React from 'react';
import { lightOrDark } from "../helpers/utils";

export default function Label({ labels }) {
  return labels.map(label => {
    if (label.name.includes("zube")) {
      return null;
    }
    const background = lightOrDark(label.color);
    return (
      <span className={`github-label ${background}`} style={{
        backgroundColor: `#${label.color}`
      }}
      >
        {label.name}
      </span>
    )
  });
}
