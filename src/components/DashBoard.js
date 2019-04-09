import React from 'react';
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Element, shape, arrayOf, func, string } from 'prop-types';
import '../App.scss';

const GET_AVATAR = gql`
  query {
    viewer {
      avatarUrl
      login
    }
  }`;

export default function DashBoard ({ action, status }) {
  // const { user, members, board } = data;
  // const onChangeHandler = (e) => {
  //   const value = e.target.value;
  //   handlers.changeMemberBoard(value);
  // }
  return (
    <nav className="flexContainer blueBackground">
      <ul className="nav flexItem flexStart">
          <li className="logo-title"><a href="/"><strong>QUADRO</strong></a></li>
      </ul>
      <ul className="nav flexContainer flexEnd">
        { status === "authenticated" ? (
          <Query query={GET_AVATAR}>
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return <span>Error :(</span>;
              return (
                  <li>
                    <a
                      className="user-profile"
                      href={`https://github.com/${data.viewer.login}`}
                      target="_blank"
                      rel="noopener noreferrer">
                        <img
                          className="user-avatar"
                          src={data.viewer.avatarUrl}>
                        </img>
                      </a>
                  </li>
              )
            }}
          </Query>
        ) : null}
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