import React from "react";
import { shape, arrayOf, func, string, bool } from "prop-types";
import "../App.scss";
import CONFIG from "../config/api";
import { toggleSideMenu } from "../helpers/ui";
import { useRepoInfo } from "../contexts/githubRepoInfo";
import { useActiveBoard } from "../contexts/activeBoard";

export default function DashBoard({ authenticated }) {
  const {
    activeBoardState: { activeBoardName: activeBoard },
    activeBoardMethods: { setActiveBoardName },
  } = useActiveBoard();
  const { loading, member, members, userAvatar } = useRepoInfo();
  const onChangeHandler = (e) => {
    e.currentTarget.blur();
    const { value } = e.target;
    setActiveBoardName(value);
  };

  return (
    <nav className="flexContainer blueBackground">
      <ul className="nav flexItem flexStart logo-menu-container">
        <li className="logo-title">
          <strong>QUADRO 🔥</strong>
        </li>
      </ul>
      <ul className="nav flexContainer flexEnd">
        {authenticated && !loading ? (
          <>
            <li className="member-dropdown">
              <label className="member-select-label" htmlFor="member-select">
                Board:
              </label>
              <select
                onChange={onChangeHandler}
                id="member-select"
                className="select-css"
                value={activeBoard}
              >
                {members.map((mem) => (
                  <option key={mem.login} value={mem.login}>
                    {mem.login}
                  </option>
                ))}
                <option disabled>_________</option>
                {Object.entries(CONFIG.meetings).map((meeting) => (
                  <option key={meeting[0]} value={meeting[0]}>
                    {meeting[1]}
                  </option>
                ))}
              </select>
            </li>
            <li className="user-profile-container">
              <button
                type="button"
                onClick={toggleSideMenu}
                onKeyPress={toggleSideMenu}
              >
                <img className="user-avatar" src={userAvatar} alt={member} />
              </button>
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}

DashBoard.propTypes = {
  authenticated: bool,
};

DashBoard.defaultProps = {
  authenticated: false,
};
