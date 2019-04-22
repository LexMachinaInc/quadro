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

export function checkViewInUrl(names) {
  const views = new Set(names);
  const params = getSearchParams();
  if (params.has("board")) {
    const view = params.get("board");
    if (views.has(view)) {
      return view;
    }
    cleanUrl();
    return null;
  }
  return null;
}

export function getStatus() {
  const params = Array.from(getSearchParams());
  return params.length ? params[0] : null;
}