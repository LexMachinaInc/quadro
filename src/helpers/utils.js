const LABELS = new Set(['0 - Backlog', '1 - Ready', '2 - Working', '3 - Done']);

function getIssueState(labels) {
  const labelObj = labels.find(label => LABELS.has(label.name));
  return labelObj ? parseInt(labelObj.name[0], 10) : null;
}

function getAssignees(assignees) {
  return assignees.map((assignee) => (
    { name: assignee.login, avatar: assignee.avatar_url }
  ));
}

export function organizeDataIntoStatusBuckets(data) {
  return data.reduce((result, issue) => {
    const status = issue.status || 0;
    result[status].push(issue);
    return result;
  }, [[], [], [], []]);
}

export function removePullRequests(issues) {
  return issues.filter((issue) => !("pull_request" in issue))
}

export function parseIssuesData(issues) {
  return issues.map((issue) => {
    const {
      title,
      created_at: created,
      html_url: issueUrl,
      labels,
      milestone,
      number: issueNumber,
      comments,
      assignees,
    } = issue;

    return {
      title,
      created,
      issueUrl,
      labels,
      milestone,
      issueNumber,
      comments,
      assignees: getAssignees(assignees),
      status: getIssueState(labels)
    };
  });
}

export function lightOrDark(color) {

  // Variables for red, green, blue values
  let r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {

      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
  }
  else {

      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );

  // Using the HSP value, determine whether the color is light or dark
  return hsp > 127.5 ? "light" : "dark";
}

export function extractInfo(data) {
  return {
    user: data.login,
    avatar: data.avatar_url,
    userPage: data.html_url
  }
}

