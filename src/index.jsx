import React from "react";
import { createRoot } from "react-dom/client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import "./index.scss";
import App from "./App";
import FireApp from "./FireApp";
import * as serviceWorker from "./serviceWorker";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB90NC2pxnpY2t8j9wimFsEsBQO1fc70z4",
  authDomain: "quadro-firebase.firebaseapp.com",
  projectId: "quadro-firebase",
  storageBucket: "quadro-firebase.appspot.com",
  messagingSenderId: "227683563488",
  appId: "1:227683563488:web:b897a2e4001ab5b3c81d85",
  measurementId: "G-VPDL2M7ZTP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const rootEl = document.getElementById("root");
const root = createRoot(rootEl);
root.render(<FireApp />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
