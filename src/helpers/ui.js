function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function cleanUrl() {
  const newurl = window.location.origin;
  window.history.pushState({ path:newurl },"", newurl);
}

export function removeZube(name) {
  return name.includes("[zube]:") ? name.replace("[zube]:", "").trim() : name;
}

export function updateUrl(member) {
  const newurl = window.location.origin + `?board=${member}`;
  window.history.pushState({ path:newurl },"", newurl);
}

export function checkMemberInUrl(members) {
  const params = getSearchParams();
  if (params.has("board")) {
    const member = params.get("board");
    if (members.has(member)) {
      return member;
    }
    cleanUrl();
    return null;
  }
  return null;
}