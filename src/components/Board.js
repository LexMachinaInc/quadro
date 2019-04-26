import React from 'react';
import { string, arrayOf, shape } from "prop-types";
import '../App.scss';
import CardContainer from './CardContainer';
import { CONFIG, GET_BUCKET, getQueryString } from "../helpers/github";

export default function Board( { member, statusLabels }) {
  return (
    <section className="lists-container center">
      {CONFIG.buckets.map((bucket) => {
        console.log('bucket', bucket)
        const queryString = getQueryString(member, bucket.key)
        const statusLabel = statusLabels.find((label) => label.name === bucket.label);
        return (
          <CardContainer
            key={bucket.key}
            title={bucket.title}
            query={GET_BUCKET}
            queryString={queryString}
            member={member}
            statusLabelId={statusLabel ? statusLabel.id : null}
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
