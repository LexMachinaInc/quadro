/* eslint-disable react/prop-types */
import React from "react";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { useSignInWithGithub } from "react-firebase-hooks/auth";

import LoginScreen from "./components/LoginScreen";
import DashBoard from "./components/DashBoard";
import Board from "./components/Board";
import { GithubTokenProvider } from "./contexts/githubToken";

export default function FireApp({ firebaseApp }) {
  const auth = getAuth(firebaseApp);
  const [signInWithGithub, result, loading, error] = useSignInWithGithub(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (result) {
    const { user } = result;
    return (
      <GithubTokenProvider authResult={result}>
        <div id="container" className="wrapper">
          <DashBoard authenticated />
          <div className="box"></div>
        </div>
      </GithubTokenProvider>
    );
  }
  return (
    <div id="container" className="wrapper">
      <DashBoard />
      <div className="box">
        <LoginScreen>
          <button type="button" onClick={() => signInWithGithub()}>
            Sign In
          </button>
        </LoginScreen>
      </div>
    </div>
  );
}
