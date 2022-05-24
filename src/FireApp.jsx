/* eslint-disable react/prop-types */
import React from "react";
import { getAuth, GithubAuthProvider } from "firebase/auth";
import { useSignInWithGithub } from "react-firebase-hooks/auth";

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
    const credential = GithubAuthProvider.credentialFromResult(result);
    const { user } = result;
    return (
      <div>
        <p>Signed In User: {user.email}</p>
        <p>Token: {credential.accessToken}</p>
      </div>
    );
  }
  return (
    <div className="App">
      <button type="button" onClick={() => signInWithGithub()}>
        Sign In
      </button>
    </div>
  );
}
