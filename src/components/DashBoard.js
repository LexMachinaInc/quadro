import React from 'react';
import { Element, shape } from 'prop-types';
import '../App.scss';

export default function DashBoard ({ action, user }) {

  return (
    <nav className="flexContainer blueBackground">
      <ul className="nav flexItem flexStart">
          <li><a href="/"><strong>QUADRO</strong></a></li>
      </ul>
      <ul className="nav flexContainer flexEnd">
        { user ? <a className="user-profile" href={user.userPage} target="_blank" rel="noopener noreferrer"><img className="user-avatar" src={user.avatar}></img></a> : null}
        <li>{action}</li>
      </ul>
    </nav>
  )
}

DashBoard.propTypes = {
  action: Element.isRequired,
  user: shape({})
}