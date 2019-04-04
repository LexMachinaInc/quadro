import React, { Component } from "react";
import DashBoard from "./components/DashBoard";
import Logout from "./components/Logout";
import Home from './components/Home';
import Board from './components/Board';
import { getToken } from "./helpers/authorization";
import { fetchUserIssues, fetchUserInfo } from "./helpers/github";
import loader from "./assets/green-loader-icon.gif";

export default class App extends Component {
  state = {
    data: null,
    loading: false,
  }

  async componentDidMount() {
    if (!this.state.data) {
      const token = await getToken();
      if (token) {
        this.initializeBoard(token);
      }
    }
  }

  initializeBoard(token) {
    this.setState({ loading: true }, async () => {
      const user = fetchUserInfo(token);
      const issues = fetchUserIssues(token);
      const [userData, issueData] = await Promise.all([user, issues]);
      if (userData && issueData) {
        this.setState({ data: { user: userData, issues: issueData}, loading: false })
      } else {
        this.setState({ loading: false })
      }
    })
  }

  render() {
    const { data, loading } = this.state;
    const logBtn = data && data.issues ? <Logout /> : <a href="/login">Login</a>;

    if (loading) {
      return (
        <div>
          <DashBoard action={<span>Logging in ...</span>} />
          <div className="loader-container"><img src={loader}></img></div>
        </div>
      )
    } else {
      const user = data && data.user ? { user: data.user } : {};
      return (
        <div id="container" className="wrapper">
          <div>
            <DashBoard action={logBtn} { ...user } />
            <div className="box">
              {data && data.issues ? <Board data={data.issues} /> : <Home /> }
            </div>
          </div>
        </div>
      );
    }
  }
}
