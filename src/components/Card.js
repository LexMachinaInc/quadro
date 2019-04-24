import React from 'react';
import { shape, string } from 'prop-types';
import Label from './Label';
import '../App.scss';

export default function Card({ issue, originBucket }) {

  const onDragStart = (issueNumber, originBucket) => (e) => {
    console.log(e, issueNumber);
    const data = JSON.stringify({ issueNumber, originBucket });
    e.dataTransfer.setData("text/plain", data);
  }

  const {
    number,
    url,
    title,
    labels,
    assignees,
  } = issue;
  const isPR = url.includes("pull");
  return (
    <div className="card" draggable onDragStart={onDragStart(number, originBucket)}  >
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
                className="assignee-avatar"
                src={assignee.node.avatarUrl}
                title={assignee.node.login}
                alt={assignee.node.login}></img>
            )}
          </span>
        </div>
        <p>{title}</p>
        <div class="labels-container"><Label labels={labels} /></div>
      </div>
    </div>
  );
}

Card.propTypes = {
  issue: shape({}).isRequired,
  originBucket: string.isRequired,
};
