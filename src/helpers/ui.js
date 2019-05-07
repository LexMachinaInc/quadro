import { CONFIG } from "./github";

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

export const toggleSideMenu = (e) => {
  e.currentTarget.blur();
  const sideMenu = document.getElementById("side-menu");
  sideMenu.classList.toggle("show-side-menu");
}

export function toggleDisplay(title) {
  const bucket = document.getElementById(title);
  bucket.classList.toggle("js-hide");
}

export function handleOnDrop(e, statusLabelId, allStatusLabels, updateIssue) {
  const { originStatusLabelId, number, labels, url } = JSON.parse(e.dataTransfer.getData("text/plain"));
  if (statusLabelId === originStatusLabelId) {
    return;
  }

  const { owner } = CONFIG;
  const originStatusName = originStatusLabelId ? allStatusLabels.find((label) => label.id === originStatusLabelId).name : null;
  const updatedLabelNames = labels
    .filter((label) => label.name !== originStatusName)
    .map((label) => label.name);

  const getRepoName = (url) => {
    const parts = url.split("/")
    const ownerIndex = parts.findIndex((part) => part === owner);
    return parts[ownerIndex + 1];
  };

  const repo = getRepoName(url);
  // Moving card into Closed bucket
  if (!statusLabelId) {
    updateIssue({ variables: { owner, repo, issue: number, labels: updatedLabelNames, state: "closed" }});
  } else {
    updatedLabelNames.push(allStatusLabels.find((label) => label.id === statusLabelId).name);
    updateIssue({ variables: { owner, repo, issue: number, labels: updatedLabelNames, state: "open" }});
  }
}