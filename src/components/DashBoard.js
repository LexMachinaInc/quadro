import React from 'react';
import { Element, shape, arrayOf, func } from 'prop-types';
import '../App.scss';

export default function DashBoard ({ handlers, action, data }) {
  const { user, members, board } = data;
  const onChangeHandler = (e) => {
    const value = e.target.value;
    handlers.changeMemberBoard(value);
  }
  return (
    <nav className="flexContainer blueBackground">
      <ul className="nav flexItem flexStart">
          <li className="logo-title"><a href="/"><strong>QUADRO</strong></a></li>
      </ul>
      <ul className="nav flexContainer flexEnd">
        { members ? (
            <li className="member-dropdown">
              <label class="member-select-label" for="member-select">Board:</label>
              <select onChange={onChangeHandler} id="member-select" className="select-css" value={board.member}>
                {members.map((mem) => (
                  <option value={mem.login}>{mem.login}</option>
                ))}
              </select>
            </li>
        ) : null }
        { user ? <li><a className="user-profile" href={user.userPage} target="_blank" rel="noopener noreferrer"><img className="user-avatar" src={user.avatar}></img></a></li> : null}
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
  handlers: shape({
    changeMemberBoard: func,
  }),
  action: Element.isRequired,
  data: shape({
    user: shape({}),
    members: arrayOf(shape({}))
  })
}