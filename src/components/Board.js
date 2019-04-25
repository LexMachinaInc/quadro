import React from 'react';
import { string, arrayOf, shape } from "prop-types";
import '../App.scss';
import CardContainer from './CardContainer';
import { CONFIG, GET_BUCKET, getQueryString } from "../helpers/github";

export default function Board( { member, statusLabels }) {
  return (
    <section className="lists-container center">
      {CONFIG.buckets.map((bucket) => {
        const queryString = getQueryString(member, bucket.key)
        return (
          <CardContainer
            key={bucket.key}
            title={bucket.title}
            query={GET_BUCKET}
            queryString={queryString}
            member={member}
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
