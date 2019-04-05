import axios from "axios";
import qs from "querystring";
import { parseIssuesData, organizeDataIntoStatusBuckets, removePullRequests, extractInfo, consolidateMembers } from "./utils";

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

export function fetchLexMachinaMembers(token) {
  const membersUrl = `https://api.github.com/orgs/LexMachinaInc/members?${
    qs.stringify({
      access_token: token,
      per_page: 50,
    })}`;

  return axios.get(membersUrl)
    .then(data => data.data)
    .then(data => data)
    .catch(error => {
      console.log(error);
      return null;
    });
}

export function fetchMemberIssues(member, token) {
  const membersIssuesUrl = `https://api.github.com/repos/LexMachinaInc/deus_lex/issues?${
    qs.stringify({
      access_token: token,
      assignee: member,
      state: "open"
    })}`;

  return axios.get(membersIssuesUrl)
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