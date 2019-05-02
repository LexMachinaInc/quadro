import React from 'react';
import { shape, string } from 'prop-types';
import Label from './Label';
import '../App.scss';

export default function Card({ issue, originStatusLabelId }) {

  const onDragStart = (issueId, originStatusLabelId, labelIds) => (e) => {
    const data = JSON.stringify({ issueId, originStatusLabelId, labelIds });
    e.dataTransfer.setData("text/plain", data);
  }

  const {
    id,
    number,
    url,
    title,
    labels,
    assignees,
  } = issue;
  const isPR = url.includes("pull");

  const labelIds = labels.map((label) => label.id);

  return (
    <div className="card" draggable onDragStart={onDragStart(id, originStatusLabelId, labelIds)}  >
      <div className="card-container">
        <div className="card-header">
          <h4 className="issue-number-container">
            <a
              className={`issue-number ${isPR ? "pull-request" : ""}`.trim()}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={isPR ? "pull request" : "issue"}
            >
                {number}
            </a>
          </h4>
          <span className="assignee-avatar-container">
            {assignees.map((assignee) =>
              <img
                key={assignee.node.login}
                className="assignee-avatar"
                src={assignee.node.avatarUrl}
                title={assignee.node.login}
                alt={assignee.node.login}></img>
            )}
          </span>
        </div>
        <p>{title}</p>
        <div className="labels-container"><Label labels={labels} /></div>
      </div>
    </div>
  );
}

Card.defaultProps = {
  originStatusLabelId: null,
}

Card.propTypes = {
  issue: shape({}).isRequired,
  originStatusLabelId: string,
};
