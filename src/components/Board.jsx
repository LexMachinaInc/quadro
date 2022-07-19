import React from "react";
import { string, arrayOf, shape } from "prop-types";
import "../App.scss";
import CardContainer from "./CardContainer";
import { GET_BUCKET, getQueryString } from "../helpers/api_interface";
import CONFIG from "../config/api";
import { useRepoInfo } from "../contexts/githubRepoInfo";
import { useActiveBoard } from "../contexts/activeBoard";

export default function Board() {
  const { labels } = useRepoInfo();
  const { activeBoard } = useActiveBoard();
  const statusLabels = labels;
  const allQueryStrings = CONFIG.buckets.reduce((result, bucket) => {
    result[bucket.key] = getQueryString(activeBoard, bucket.key);
    return result;
  }, {});
  return (
    <section className="lists-container center">
      {CONFIG.buckets.map((bucket) => {
        const queryString = allQueryStrings[bucket.key];
        const statusLabel = statusLabels.find(
          (label) => label.name === bucket.label,
        );
        return (
          <CardContainer
            key={bucket.key}
            title={bucket.title}
            query={GET_BUCKET}
            queryString={queryString}
            statusLabelId={statusLabel ? statusLabel.id : null}
            allQueryStrings={allQueryStrings}
            allStatusLabels={statusLabels}
          />
        );
      })}
    </section>
  );
}

Board.propTypes = {};
