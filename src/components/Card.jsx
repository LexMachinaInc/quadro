import React from "react";
import { shape, string } from "prop-types";
import Label from "./Label";
import "../App.scss";
import PullRequestIcon from "../assets/pull-request.svg";

export default function Card({ issue, originStatusLabelId }) {
  const onDragStart = (originStatusLabelId, number, labels, url) => (e) => {
    const data = JSON.stringify({ originStatusLabelId, number, labels, url });
    e.dataTransfer.setData("text/plain", data);
  };

  const { number, url, title, labels, assignees } = issue;
  const isPR = url.includes("pull");

  return (
    <div
      className="card"
      draggable
      onDragStart={onDragStart(originStatusLabelId, number, labels, url)}
    >
      <div className="card-container">
        <div className="card-header">
          <h4 className="issue-number-container">
            {isPR ? (
              <img
                className="issue-pull-request-icon"
                src={PullRequestIcon}
                alt="Pull Request Icon"
              />
            ) : null}
            <a
              className="issue-number"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title={isPR ? "pull request" : "issue"}
            >
              {number}
            </a>
          </h4>
          <span className="assignee-avatar-container">
            {assignees.map((assignee) => (
              <img
                key={assignee.node.login}
                className="assignee-avatar"
                src={assignee.node.avatarUrl}
                title={assignee.node.login}
                alt={assignee.node.login}
              ></img>
            ))}
          </span>
        </div>
        <p>{title}</p>
        <div className="labels-container">
          <Label labels={labels} />
        </div>
      </div>
    </div>
  );
}

Card.defaultProps = {
  originStatusLabelId: null,
};

Card.propTypes = {
  issue: shape({}).isRequired,
  originStatusLabelId: string,
};
