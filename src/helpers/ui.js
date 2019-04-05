export function removeZube(name) {
  return name.includes("[zube]:") ? name.replace("[zube]:", "").trim() : name;
}