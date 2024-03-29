import axios from "axios";
import CONFIG from "../config/api";
import { getToken } from "./authorization";

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function cleanUrl() {
  const newurl = window.location.origin;
  window.history.pushState({ path: newurl }, "", newurl);
}

export function removeZube(name) {
  return name.includes("[zube]:") ? name.replace("[zube]:", "").trim() : name;
}

export function updateUrl(member) {
  const newurl = window.location.origin + `?board=${member}`;
  window.history.pushState({ path: newurl }, "", newurl);
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
};

export function toggleDisplay(title) {
  const bucket = document.getElementById(title);
  bucket.classList.toggle("js-hide");
}

export function toggleStatusLabels(hide) {
  const hidden = "js-hide";
  const labels = [...document.getElementsByClassName("status-label")];
  labels.forEach((label) =>
    hide ? label.classList.add(hidden) : label.classList.remove(hidden),
  );
}

export async function getLabelsForIssue(url) {
  const token = await getToken();
  return axios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((data) => data.data);
}

function extractLabels(labels, allStatusLabels) {
  return labels
    .filter((label) => !allStatusLabels.has(label.name))
    .map((label) => label.name);
}

function getRepoName(url, owner) {
  const parts = url.split("/");
  const ownerIndex = parts.findIndex((part) => part === owner);
  return parts[ownerIndex + 1];
}

export async function handleOnDrop(
  e,
  statusLabelId,
  allStatusLabels,
  updateIssue,
) {
  const { originStatusLabelId, number, labels, url } = JSON.parse(
    e.dataTransfer.getData("text/plain"),
  );
  if (statusLabelId === originStatusLabelId) {
    return;
  }

  const { owner } = CONFIG;

  const repo = getRepoName(url, owner);

  const allStatusLabelNames = new Set(
    allStatusLabels.map((label) => label.name),
  );
  const fetchedIssues = await getLabelsForIssue(
    `https://api.github.com/repos/${owner}/${repo}/issues/${number}`,
  );
  const labelsToUpdate = fetchedIssues
    ? extractLabels(fetchedIssues.labels, allStatusLabelNames)
    : extractLabels(labels, allStatusLabelNames);

  // Moving card into Closed bucket
  if (!statusLabelId) {
    updateIssue({
      variables: {
        owner,
        repo,
        issue: number,
        labels: labelsToUpdate,
        state: "closed",
      },
    });
  } else {
    labelsToUpdate.push(
      allStatusLabels.find((label) => label.id === statusLabelId).name,
    );
    updateIssue({
      variables: {
        owner,
        repo,
        issue: number,
        labels: labelsToUpdate,
        state: "open",
      },
    });
  }
}
