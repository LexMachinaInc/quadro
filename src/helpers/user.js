import USER_CONFIG from "../config/user.json";

const colDisplayKey = USER_CONFIG.localStorage.colDisplaySetting;

export function saveUserColDisplaySetting(buckets) {
  localStorage.setItem(colDisplayKey, JSON.stringify(buckets));
}

export function getUserColDisplaySetting() {
  const colDisplaySetting = localStorage.getItem(colDisplayKey);
  return colDisplaySetting ? JSON.parse(colDisplaySetting) : null;
}