import React from 'react';
import { string, arrayOf, shape } from "prop-types";
import '../App.scss';
import CardContainer from './CardContainer';
import { CONFIG, GET_BUCKET, getQueryString } from "../helpers/github";

export default function Board( { member, statusLabels }) {
  const allQueryStrings = CONFIG.buckets.reduce((result, bucket) => {
    result[bucket.key] = getQueryString(member, bucket.key);
    return result;
  }, {});
  return (
    <section className="lists-container center">
      {CONFIG.buckets.map((bucket) => {
        const queryString = allQueryStrings[bucket.key];
        const statusLabel = statusLabels.find((label) => label.name === bucket.label);
        return (
          <CardContainer
            key={bucket.key}
            title={bucket.title}
            query={GET_BUCKET}
            queryString={queryString}
            statusLabelId={statusLabel ? statusLabel.id : null}
            allQueryStrings={allQueryStrings}
          />
        );
      })}
    </section>
  );
}

Board.propTypes = {
  member: string.isRequired,
  statusLabels: arrayOf(shape({})).isRequired,
}
