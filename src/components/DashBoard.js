import React, { PureComponent } from 'react';
import { Element } from 'prop-types';
import '../App.scss';

export default function DashBoard ({ action }) {

  return (
    <nav className="flexContainer blueBackground">
      <ul className="nav flexItem flexStart">
          <li><a href="/">QUADRO</a></li>
      </ul>
      <ul className="nav flexContainer flexEnd">
        <li>{action}</li>
      </ul>
    </nav>
  )
}

DashBoard.propTypes = {
  action: Element.isRequired,
}