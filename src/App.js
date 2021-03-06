import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import DashBoard from "./components/DashBoard";
import Logout from "./components/Logout";
import Home from "./components/Home";
import Board from "./components/Board";
import SideMenu from "./components/SideMenu";
import { getToken } from "./helpers/authorization";
import { getApolloClient, DASHBOARD_DATA } from "./helpers/api_interface";
import { CONFIG } from "./config/api";
import { updateUrl, checkViewInUrl, getStatus } from "./helpers/ui";
import { extractMemberNames } from "./helpers/utils";

const client = getApolloClient();

export default class App extends Component {
  static setStatus() {
    const status = getStatus();
    return status ? status : "initial";
  }
  state = {
    status: "initial",
    member: undefined,
    avatar: undefined,
    members: undefined,
    loginLoad: false,
  }

  async componentDidMount() {
    const status = App.setStatus();
    if ( status && status[0] === "redirecting" ) {
      this.setState({ status: status[0] });
    }
    const token = await getToken();
    if (token) {
      this.logUserIn();
    }
  }

  logUserIn() {
    client
      .query({query: DASHBOARD_DATA, variables: {owner: CONFIG.owner, repo: CONFIG.repo}})
      .then(result => {
        const {
          viewer: {
            login: member, avatarUrl: avatar },
            repository: {
              labels: { nodes: statusLabels },
              assignableUsers: { nodes: members }}
            } = result.data;
        const memberNames = extractMemberNames(members);
        const meetings = Object.keys(CONFIG.meetings)
        const viewInUrl = checkViewInUrl([...memberNames, ...meetings]);
        this.setState({
          status: "authenticated",
          member: viewInUrl ? viewInUrl : member,
          avatar,
          members,
          statusLabels
        })
        if (!viewInUrl) {
          updateUrl(member);
        }
      });
  }

  changeMemberBoard(member) {
    updateUrl(member);
    this.setState({ member });
  }

  render() {
    const { status, member, avatar, members, statusLabels } = this.state;
    const logBtn = status === "authenticated" ? <Logout /> : null;
    const handlers = {
      changeMemberBoard: this.changeMemberBoard.bind(this),
    };
    const authenticated = status === "authenticated";
    const redirecting = status === "redirecting";

    return (
      <ApolloProvider client={client}>
        <div id="container" className="wrapper">
          <DashBoard
            status={status}
            handlers={handlers}
            member={member}
            avatar={avatar}
            members={members}
          />
          <div className="box">
            { authenticated ?
              <Board
                member={member}
                statusLabels={statusLabels}
              /> : redirecting ? null : <Home /> }
          </div>
        </div>
        { authenticated ? (
          <SideMenu
            action={logBtn}
            buckets={CONFIG.buckets.map((bucket) => bucket.title)} />
          ) : null}
      </ApolloProvider>
    );
  }
}
