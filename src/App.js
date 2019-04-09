import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { gql } from "apollo-boost";
import DashBoard from "./components/DashBoard";
import Logout from "./components/Logout";
import Home from './components/Home';
import Board from './components/Board';
import { getToken } from "./helpers/authorization";
import { fetchUserIssues, fetchUserInfo, fetchLexMachinaMembers, fetchMemberIssues } from "./helpers/github";
import loader from "./assets/green-loader-icon.gif";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  request: async operation => {
    const token = await getToken();
    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`
        }
      });
    }
  }
});

export default class App extends Component {
  state = {
    status: "initial",
  }

  async componentDidMount() {
    const token = await getToken();
    if (token) {
      this.setState( { status: "authenticated" });
    }
    // client
    //   .query({
    //     query: gql`
    //       {
    //         viewer {
    //           avatarUrl
    //         }
    //       }
    //     `
    //   })
    //   .then(result => console.log(result))

    // if (!this.state.data) {
    //   const token = await getToken();
    //   if (token) {
    //     this.initializeBoard(token);
    //   }
    // }
  }

  initializeBoard(token) {
    this.setState({ loading: true }, async () => {
      const user = fetchUserInfo(token);
      const issues = fetchUserIssues(token);
      const members = fetchLexMachinaMembers(token);
      const [userData, issueData, membersData] = await Promise.all([user, issues, members]);
      if (userData && issueData) {
        this.setState({
          data: {
            user: userData,
            issues: issueData,
            members: membersData,
            board: { member: userData.user }
          },
          loading: false,
        })
      } else {
        this.setState({ loading: false })
      }
    })
  }

  changeMemberBoard(member) {
    const data = {
      ...this.state.data,
      board: { member }
    };

    this.setState({ data, loading: true }, async () => {
      const token = await getToken();
      const issues = await fetchMemberIssues(member, token);
      const data = {
        ...this.state.data,
        issues,
      };
      this.setState({ data, loading: false })
    });

  }

  render() {
    const { status } = this.state;
    const logBtn = status === "authenticated" ? <Logout /> : <a href="/login">Login</a>;
    return (
      <ApolloProvider client={client}>
        <div id="container" className="wrapper">
          <div>
            <DashBoard  action={logBtn} status={status} />
            {/* <div className="box">
              { status === "authenticated" ? <Board /> : <Home /> }
            </div> */}
          </div>
        </div>
      </ApolloProvider>
    );



    //TODO: restructure this to use destructuring with defaults
    // const { data, loading } = this.state;
    // const user = data && data.user;
    // const members = data && data.members;
    // const issues = data && data.issues;
    // const board = data && data.board;d
    // const logBtn = user || members || issues ? <Logout /> : <a href="/login">Login</a>;
    // const handlers = {
    //   changeMemberBoard: this.changeMemberBoard.bind(this),
    // };

    // if (loading && !data) {
    //   return (
    //     <div>
    //       <DashBoard action={<span>Logging in ...</span>} />
    //       <div className="loader-container"><img src={loader}></img></div>
    //     </div>
    //   )
    // } else if (loading) {
    //   return (
    //     <div>
    //       <DashBoard handlers={handlers} action={logBtn} data={ { user, members, board } } />
    //       <div className="loader-container"><img src={loader}></img></div>
    //     </div>
    //   )
    // } else {
    //   return (
        // <div id="container" className="wrapper">
        //   <div>
        //     <DashBoard handlers={handlers} action={logBtn} data={ { user, members, board } } />
        //     <div className="box">
        //       {issues ? <Board data={issues} /> : <Home /> }
        //     </div>
        //   </div>
        // </div>
    //   );
    // }
  }
}
