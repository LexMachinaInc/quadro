import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { gql } from "apollo-boost";
import DashBoard from "./components/DashBoard";
import Logout from "./components/Logout";
import Home from './components/Home';
import Board from './components/Board';
import { getToken } from "./helpers/authorization";
import { getApolloClient } from "./helpers/github";

const client = getApolloClient();

export default class App extends Component {
  state = {
    status: "initial",
    member: undefined,
  }

  async componentDidMount() {
    const token = await getToken();
    if (token) {
      this.logUserIn();
    }
  }

  logUserIn() {
    client
      .query({
        query: gql`
        query {
          viewer {
            login
          }
        }`
      })
      .then(result => this.setState({
        status: "authenticated",
        member: result.data.viewer.login
      }));
  }

  changeMemberBoard(member) {
    this.setState({ member });
  }

  render() {
    const { status, member } = this.state;
    const logBtn = status === "authenticated" ? <Logout /> : <a href="/login">Login</a>;
    const handlers = {
      changeMemberBoard: this.changeMemberBoard.bind(this),
    };
    return (
      <ApolloProvider client={client}>
        <div id="container" className="wrapper">
          <div>
            <DashBoard  action={logBtn} status={status} handlers={handlers} member={member} />
            <div className="box">
              { status === "authenticated" ? <Board member={member} /> : <Home /> }
            </div>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}
