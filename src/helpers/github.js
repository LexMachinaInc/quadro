import axios from "axios";
import qs from "querystring";
import { parseIssuesData, organizeDataIntoStatusBuckets, removePullRequests, extractInfo } from "./utils";

export function fetchUserIssues(token, state = "open") {
  const issuesUrl = `https://api.github.com/orgs/LexMachinaInc/issues?${
    qs.stringify({
      filter: 'assigned',
      state,
      access_token: token
    })}`;

  return axios.get(issuesUrl)
    .then(data => data.data)
    .then(removePullRequests)
    .then(parseIssuesData)
    .then(organizeDataIntoStatusBuckets)
    .then(data => data)
    .catch(error => {
      console.log(error);
      return null;
    });
}

export function fetchUserInfo(token) {
  const userUrl = `https://api.github.com/user?${
    qs.stringify({
      access_token: token
    })}`;

  return axios.get(userUrl)
    .then(data => data.data)
    .then(extractInfo)
    .then(data => data)
    .catch(error => {
      console.log(error);
      return null;
    });
}