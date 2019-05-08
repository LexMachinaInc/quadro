import React from 'react';
import { shape, arrayOf, func, string } from 'prop-types';
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
        <li className="logo-title"><strong>QUADRO</strong></li>
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
            <li className="user-profile-container">
              <button>
                <img
                  className="user-avatar"
                  src={avatar}
                  alt={member}
                  onClick={toggleSideMenu}
                >
                </img>
              </button>
            </li>
          </React.Fragment>
        ): null}
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
  status: string.isRequired,
  data: shape({
    user: shape({}),
    members: arrayOf(shape({}))
  })
}