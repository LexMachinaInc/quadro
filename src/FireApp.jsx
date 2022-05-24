/* eslint-disable react/prop-types */
import React from "react";
import { getAuth } from "firebase/auth";
import { useSignInWithGithub } from "react-firebase-hooks/auth";

import LoginScreen from "./components/LoginScreen";
import DashBoard from "./components/DashBoard";
import { GithubClientProvider } from "./contexts/githubClient";
import { GithubRepoInfoProvider } from "./contexts/githubRepoInfo";

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
      <GithubClientProvider authResult={result}>
        <GithubRepoInfoProvider>
          <div id="container" className="wrapper">
            <DashBoard authenticated />
            <div className="box"></div>
          </div>
        </GithubRepoInfoProvider>
      </GithubClientProvider>
    );
  }
  return (
    <div id="container" className="wrapper">
      <DashBoard />
      <div className="box">
        <LoginScreen>
          <button
            type="button"
            onClick={() => signInWithGithub(["user", "repo"])}
          >
            Sign In
          </button>
        </LoginScreen>
      </div>
    </div>
  );
}
