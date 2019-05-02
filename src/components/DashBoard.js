import React from 'react';
import { element, shape, arrayOf, func, string } from 'prop-types';
import '../App.scss';
import { CONFIG } from "../helpers/github";
import { toggleSideMenu } from "../helpers/ui";

export default function DashBoard ({ action, status, handlers, member, members, avatar }) {
  const onChangeHandler = (e) => {
    e.currentTarget.blur();
    const value = e.target.value;
    handlers.changeMemberBoard(value);
  };

  return (
    <nav className="flexContainer blueBackground">
      <ul className="nav flexItem flexStart logo-menu-container">
        <button className="sidebar-menu-btn" onClick={toggleSideMenu}>
          <span className="sidebar-menu-content">☰</span>
        </button>
        <li className="logo-title"><a href="/"><strong>QUADRO</strong></a></li>
      </ul>
      <ul className="nav flexContainer flexEnd">
        { status === "authenticated" ? (
          <React.Fragment>
            <li className="member-dropdown">
              <label className="member-select-label" htmlFor="member-select">Board:</label>
              <select onChange={onChangeHandler} id="member-select" className="select-css" value={member}>
                {members.map((mem) => (
                  <option key={mem.login} value={mem.login}>{mem.login}</option>
                ))}
                {<option disabled>_________</option>}
                {Object.entries(CONFIG.meetings).map((meeting) => (
                  <option key={meeting[0]} value={meeting[0]}>{meeting[1]}</option>
                ))}
              </select>
            </li>
            <li>
              <a
                className="user-profile"
                href={`https://github.com/${member}`}
                target="_blank"
                rel="noopener noreferrer">
                  <img
                    className="user-avatar"
                    src={avatar}
                    alt={member}
                  >
                  </img>
                </a>
            </li>
          </React.Fragment>
        ): null}
        <li>{action}</li>
      </ul>
    </nav>
  )
}

DashBoard.defaultProps = {
  data: {
    user: undefined,
    members: undefined,
  },
}

DashBoard.propTypes = {
  handlers: shape({
    changeMemberBoard: func,
  }),
  action: element,
  status: string.isRequired,
  data: shape({
    user: shape({}),
    members: arrayOf(shape({}))
  })
}