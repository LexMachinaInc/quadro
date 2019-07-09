const ZUBE_LABELS = {
  "[zube]: Backlog": 0,
  "[zube]: Ready": 1,
  "[zube]: In Progress": 2,
  "[zube]: Done": 3,
};

export const WAFFLE_LABELS = new Set(["0 - Backlog", "1 - Ready", "2 - Working", "3 - Done"]);

export function getIssueState(labels = []) {
  const zubeLabelObj = labels.find(label => label.name in ZUBE_LABELS);
  const waffleLabelObj = labels.find(label => WAFFLE_LABELS.has(label.name));
  if (zubeLabelObj) {
    return ZUBE_LABELS[zubeLabelObj.name];
  } else if (waffleLabelObj) {
    return parseInt(waffleLabelObj.name[0], 10)
  }
  return 0;
}

export function organizeDataIntoStatusBuckets(data) {
  return data.reduce((result, issue) => {
    const status = issue.status || 0;
    result[status].push(issue);
    return result;
  }, [[], [], [], []]);
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

      /* eslint-disable no-mixed-operators */
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

export function extractMemberNames(members){
  return members.map((member) => member.login);
}