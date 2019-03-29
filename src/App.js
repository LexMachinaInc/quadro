import React, { Component } from "react";
import DashBoard from "./components/DashBoard";
import Logout from "./components/Logout";
import Home from './components/Home';
import Board from './components/Board';
import { getCookie, setCookie } from "./helpers/cookies";
import qs from "querystring";
import axios from "axios";
import { parseIssuesData, organizeDataIntoStatusBuckets, removePullRequests } from "./helpers/utils";
import loader from "./assets/green-loader-icon.gif";

export default class App extends Component {
  state = {
    data: null,
    loading: false,
  }

  async componentDidMount() {
    if (!this.state.data) {
      const token = await this.getToken();
      if (token) {
        this.fetchIssues(token);
      }
    }
  }

  getToken() {
    const quadro = getCookie("quadro");
    if (quadro != null) {
      return quadro;
    } else {
      return axios("/authenticated")
        .then(resp => resp.data)
        .then(({ token }) => {
          if (token) {
            setCookie("quadro", token, 14)
            return token;
          }
        })
        .catch(err => console.log(err));
    }
  }

  fetchIssues(token) {
    this.setState({loading: true})
    const issuesUrl = `https://api.github.com/orgs/LexMachinaInc/issues?${
      qs.stringify({
        filter: 'assigned',
        state: 'open',
        access_token: token
      })}`;

    return axios.get(issuesUrl)
      .then(data => data.data)
      .then(removePullRequests)
      .then(parseIssuesData)
      .then(organizeDataIntoStatusBuckets)
      .then(data => this.setState({data, loading: false}))
      .catch(error => {
        console.log(error);
        this.setState({loading: false});
      });
  }

  render() {
    const { data, loading } = this.state;
    const logBtn = data ? <Logout /> : <a href="/login">Login</a>;

    if (loading) {
      return (
        <div>
          <DashBoard action={<span>Logging in ...</span>} />
          <div className="loader-container"><img src={loader}></img></div>
        </div>
      )
    } else {
      return (
        <div id="container" className="wrapper">
          <div>
            <DashBoard action={logBtn} />
            <div className="box">
              {data ? <Board data={data} /> : <Home /> }
            </div>
          </div>
        </div>
      );
    }
  }
}
