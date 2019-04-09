import React from 'react';
import { shape } from 'prop-types';
import Label from './Label';
import '../App.scss';

export default function Card({ issue }) {
  const {
    number, url, title, labels: { nodes: issueLabels }, assignees: { edges: issueAssignees },
  } = issue;
  return (
    <div className="card">
      <div className="card-container">
        <div className="card-header">
          <h4 className="issue-number-container">
            <a
              className="issue-number"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
                {number}
            </a>
          </h4>
          <span className="assignee-avatar-container">{issueAssignees.map((assignee) => <img className="assignee-avatar" src={assignee.node.avatarUrl} title={assignee.node.login} alt={assignee.node.login}></img>)}</span>
        </div>
        <p>{title}</p>
        <div class="labels-container"><Label labels={issueLabels} /></div>
      </div>
    </div>
  );
}

Card.propTypes = {
  issue: shape({}).isRequired,
};
