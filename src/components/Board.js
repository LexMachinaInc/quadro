import React from 'react';
import { Query } from "react-apollo";
import { arrayOf, shape } from "prop-types";
import '../App.scss';
import CardContainer from './CardContainer';
import EmptyBoard from "./EmptyBoard";
import { getIssueState, organizeDataIntoStatusBuckets } from "../helpers/utils";
import { BACKLOG_QUERY_STRING, READY_QUERY_STRING, PROGRESS_QUERY_STRING, DONE_QUERY_STRING, CLOSED_QUERY_STRING, GET_BUCKET } from "../helpers/github";
import Loader from "./Loader";

export default function Board( { member }) {
  return (
    <section className="lists-container center">
      {Board.buckets.map((bucket) => (
        <CardContainer
          key={bucket.title}
          title={bucket.title}
          query={bucket.query}
          queryString={bucket.queryString}
          member={member}
        />
      ))}
    </section>
  );
}

Board.propTypes = {
  data: arrayOf(shape({})).isRequired,
}

Board.buckets = [
  {title: "Backlog", query: GET_BUCKET, queryString: BACKLOG_QUERY_STRING },
  {title: "Ready", query: GET_BUCKET, queryString: READY_QUERY_STRING },
  {title: "In Progress", query: GET_BUCKET, queryString: PROGRESS_QUERY_STRING },
  {title: "Done", query: GET_BUCKET, queryString: DONE_QUERY_STRING },
  {title: "Closed", query: GET_BUCKET, queryString: CLOSED_QUERY_STRING },
];
