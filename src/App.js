import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import DashBoard from "./components/DashBoard";
import Logout from "./components/Logout";
import Home from './components/Home';
import Board from './components/Board';
import { getToken } from "./helpers/authorization";
import { getApolloClient, DASHBOARD_DATA } from "./helpers/github";
import { updateUrl, checkMemberInUrl, cleanUrl } from "./helpers/ui";
import { extractMemberNames } from "./helpers/utils";

const client = getApolloClient();

export default class App extends Component {
  state = {
    status: "initial",
    member: undefined,
    avatar: undefined,
    members: undefined,
  }

  async componentDidMount() {
    const token = await getToken();
    if (token) {
      this.logUserIn();
    }
  }

  logUserIn() {
    client
      .query({query: DASHBOARD_DATA})
      .then(result => {
        const member = result.data.viewer.login;
        const members = extractMemberNames(result.data.repository.assignableUsers.nodes);
        const memberInUrl = checkMemberInUrl(members);
        this.setState({
          status: "authenticated",
          member: memberInUrl ? memberInUrl : member,
          avatar: result.data.viewer.avatarUrl,
          members: result.data.repository.assignableUsers.nodes
        })
      });
  }

  changeMemberBoard(member) {
    updateUrl(member);
    this.setState({ member });
  }

  render() {
    const { status, member, avatar, members } = this.state;
    const logBtn = status === "authenticated" ? <Logout /> : <a href="/login">Login</a>;
    const handlers = {
      changeMemberBoard: this.changeMemberBoard.bind(this),
    };
    return (
      <ApolloProvider client={client}>
        <div id="container" className="wrapper">
          <div>
            <DashBoard  action={logBtn} status={status} handlers={handlers} member={member} avatar={avatar} members={members} />
            <div className="box">
              { status === "authenticated" ? <Board member={member} /> : <Home /> }
            </div>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}
