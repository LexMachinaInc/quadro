import React from 'react';
import { Query } from "react-apollo";
import { DASHBOARD_DATA } from "../helpers/github";
import { Element, shape, arrayOf, func, string } from 'prop-types';
import '../App.scss';

export default function DashBoard ({ action, status, handlers, member, members, avatar }) {
  const onChangeHandler = (e) => {
    const value = e.target.value;
    handlers.changeMemberBoard(value);
  };

  return (
    <nav className="flexContainer blueBackground">
      <ul className="nav flexItem flexStart">
          <li className="logo-title"><a href="/"><strong>QUADRO</strong></a></li>
      </ul>
      <ul className="nav flexContainer flexEnd">
        { status === "authenticated" ? (
          <React.Fragment>
            <li className="member-dropdown">
              <label class="member-select-label" for="member-select">Board:</label>
              <select onChange={onChangeHandler} id="member-select" className="select-css" value={member}>
                {members.map((mem) => (
                  <option value={mem.login}>{mem.login}</option>
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
                    src={avatar}>
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
  }
}

DashBoard.propTypes = {
  handlers: shape({
    changeMemberBoard: func,
  }),
  action: Element.isRequired,
  status: string.isRequired,
  data: shape({
    user: shape({}),
    members: arrayOf(shape({}))
  })
}