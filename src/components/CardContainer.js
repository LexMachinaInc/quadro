import React from 'react';
import { string, arrayOf, shape } from 'prop-types';
import '../App.scss';
import Card from './Card';

export default function CardContainer({ title, issues }) {
  return (
    <div className="list">
      <h3 className="list-title">{title}</h3>
      <ul className="list-items">
        {issues.map(issue => (
          <li>
            <Card key={issue.number} issue={issue} />
          </li>
        ))}
      </ul>
    </div>
  );
}

CardContainer.propTypes = {
  title: string.isRequired,
  issues: arrayOf([shape({})]).isRequired,
};
