import React from 'react';
import { shape } from 'prop-types';
import Label from './Label';
import '../App.scss';

export default function Card({ issue }) {
  const {
    issueNumber, issueUrl, title, labels
  } = issue;
  return (
    <div className="card">
      <div className="card-container">
      <h4 className="issue-number-container"><a className="issue-number" href={issueUrl} target="_blank" rel="noopener noreferrer">{issueNumber}</a></h4>
        <p>{title}</p>
        <div class="labels-container"><Label labels={labels} /></div>
      </div>
    </div>
  );
}

Card.propTypes = {
  issue: shape({}).isRequired,
};
