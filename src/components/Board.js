import React from 'react';
import { arrayOf, shape } from "prop-types";
import '../App.scss';
import CardContainer from './CardContainer';

export default function Board({ data}) {
  return (
    <div>
      <section className="lists-container center">
        {data.map((bucket, idx) => (
          <CardContainer
            key={Board.statusMap[idx]}
            title={Board.statusMap[idx]}
            issues={bucket}
          />
        ))}
      </section>
    </div>
  );
}

Board.propTypes = {
  data: arrayOf(shape({})).isRequired,
}

Board.statusMap = {
  0: 'Backlog',
  1: 'Ready',
  2: 'In Progress',
  3: 'Done',
}
