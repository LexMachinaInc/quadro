import React from 'react';
import { arrayOf, shape } from "prop-types";
import '../App.scss';
import CardContainer from './CardContainer';
import organizeDataIntoStatusBuckets from '../helpers/utils';

export default class Board extends React.Component {

  static propTypes = {
    data: arrayOf(shape({})).isRequired,
  }

  static statusMap = {
    0: '0 - Backlog',
    1: '1 - Ready',
    2: '2 - Working',
    3: '3 - Done',
  }

  render() {
    const { data } = this.props;
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
}
