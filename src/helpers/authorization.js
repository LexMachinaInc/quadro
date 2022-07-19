import axios from "axios";
import APP_CONFIG from "../config/app.json";

const AUTH_TOKEN_KEY = APP_CONFIG.cookies.authToken;

export function getCookie(name) {
  const v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : null;
}

export function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = `${name}=${value};path=/;expires=${date.toGMTString()}`;
}

export function deleteCookie(name) {
  setCookie(name, "", -1);
}

export function getToken() {
  const quadro = getCookie(AUTH_TOKEN_KEY);
  if (quadro != null) {
    return quadro;
  } else {
    return axios("/authenticated")
      .then((resp) => resp.data)
      .then(({ token }) => {
        if (token) {
          setCookie(AUTH_TOKEN_KEY, token, 14);
          return token;
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        return null;
      });
  }
}

export function logOut(e) {
  e.preventDefault();
  deleteCookie("quadro");
  fetch("/logout")
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.logout === "success") {
        window.location.replace("/?loggedout");
      }
    });
}
