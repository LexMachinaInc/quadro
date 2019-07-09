import USER_CONFIG from "../config/user.json";

const colDisplayKey = USER_CONFIG.localStorage.colDisplaySetting;
const statusLabelKey = USER_CONFIG.localStorage.statusLabelSetting;

export function saveUserColDisplaySetting(buckets) {
  localStorage.setItem(colDisplayKey, JSON.stringify(buckets));
}

export function getUserColDisplaySetting() {
  const colDisplaySetting = localStorage.getItem(colDisplayKey);
  return colDisplaySetting ? JSON.parse(colDisplaySetting) : null;
}

export function saveUserHideStatusLabelSetting(checked) {
  localStorage.setItem(statusLabelKey, JSON.stringify(checked));
}

export function getUserHideStatusLabelSetting() {
  const hideStatusLabelSetting = localStorage.getItem(statusLabelKey);
  return hideStatusLabelSetting ? JSON.parse(hideStatusLabelSetting) : false;
}