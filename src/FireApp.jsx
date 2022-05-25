/* eslint-disable react/prop-types */
import React from "react";
import { getAuth, GithubAuthProvider } from "firebase/auth";

import { useAuthState, useSignInWithGithub } from "react-firebase-hooks/auth";
import useCookie from "react-use-cookie";

import LoginScreen from "./components/LoginScreen";
import DashBoard from "./components/DashBoard";
import Board from "./components/Board";
import { GithubClientProvider } from "./contexts/githubClient";
import { GithubRepoInfoProvider } from "./contexts/githubRepoInfo";

function Login({ signInWithGithub }) {
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

export default function FireApp({ firebaseApp }) {
  const auth = getAuth(firebaseApp);
  const [user, loading, error] = useAuthState(auth);
  const [signInWithGithub, result, githubLoading, githubError] =
    useSignInWithGithub(auth);
  const [githubToken, setGithubToken] = useCookie(`githubToken`, undefined);

  if (error || githubError) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading || githubLoading) {
    return <p>Loading...</p>;
  }
  if (user) {
    if (!githubToken) {
      if (result) {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const { accessToken } = credential;
        setGithubToken(accessToken);
      } else {
        return <Login signInWithGithub={signInWithGithub} />;
      }
    }
    return (
      <GithubClientProvider accessToken={githubToken}>
        <GithubRepoInfoProvider>
          <div id="container" className="wrapper">
            <DashBoard authenticated />
            <div className="box">
              <Board member="gcarothers" />
            </div>
          </div>
        </GithubRepoInfoProvider>
      </GithubClientProvider>
    );
  }
  return <Login signInWithGithub={signInWithGithub} />;
}
