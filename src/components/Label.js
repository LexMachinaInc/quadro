import React from 'react';
import { lightOrDark } from "../helpers/utils";

export default function Label({ labels }) {
  return labels.map(label => {
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
