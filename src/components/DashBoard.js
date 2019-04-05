import React from 'react';
import { Element, shape, arrayOf } from 'prop-types';
import '../App.scss';

export default function DashBoard ({ action, data }) {
  const { user, members } = data;
  return (
    <nav className="flexContainer blueBackground">
      <ul className="nav flexItem flexStart">
          <li className="logo-title"><a href="/"><strong>QUADRO</strong></a></li>
      </ul>
      { members ? (
        <ul className="nav flexItem flexStart">
          <li className="member-dropdown">
            <label class="member-select-label" for="member-select">Board:</label>
            <select id="member-select" className="select-css" value={user.user}>
              {members.map((mem) => (
                <option value={mem.login}>{mem.login}</option>
              ))}
            </select>
          </li>
        </ul>
      ) : null }
      <ul className="nav flexContainer flexEnd">
        { user ? <a className="user-profile" href={user.userPage} target="_blank" rel="noopener noreferrer"><img className="user-avatar" src={user.avatar}></img></a> : null}
        <li>{action}</li>
      </ul>
    </nav>
  )
}

DashBoard.defaultProps = {
  data: {
    user: undefined,
    members: undefined,
  }
}

DashBoard.propTypes = {
  action: Element.isRequired,
  data: shape({
    user: shape({}),
    members: arrayOf(shape({}))
  })
}