import axios from "axios";
import qs from "querystring";
import { parseIssuesData, organizeDataIntoStatusBuckets, removePullRequests, extractInfo, consolidateMembers } from "./utils";

function fetchIssues(url, token) {
  return axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
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

export function fetchUserIssues(token, state = "open") {
  const issuesUrl = `https://api.github.com/orgs/LexMachinaInc/issues?${
    qs.stringify({
      filter: 'assigned',
      state,
    })}`;

  return fetchIssues(issuesUrl, token)
}

export function fetchMemberIssues(member, token) {
  const membersIssuesUrl = `https://api.github.com/repos/LexMachinaInc/deus_lex/issues?${
    qs.stringify({
      assignee: member,
      state: "open"
    })}`;

  return fetchIssues(membersIssuesUrl, token);
}

export function fetchUserInfo(token) {
  const userUrl = "https://api.github.com/user";

  return axios.get(userUrl, { headers: { Authorization: `Bearer ${token}` } })
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
      per_page: 50,
    })}`;

  return axios.get(membersUrl, { headers: { Authorization: `Bearer ${token}` } })
    .then(data => data.data)
    .then(data => data)
    .catch(error => {
      console.log(error);
      return null;
    });
}