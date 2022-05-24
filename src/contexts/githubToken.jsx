import React, { createContext, useContext } from "react";
import { shape, node, string } from "prop-types";

import { GithubAuthProvider } from "firebase/auth";

/**
 * The React Context object for github token
 */
const GithubTokenContext = createContext({});

const useGithubToken = () => useContext(GithubTokenContext);

function GithubTokenProvider({ children, authResult }) {
  const credential = GithubAuthProvider.credentialFromResult(authResult);
  return (
    <GithubTokenContext.Provider value={credential.token}>
      {children}
    </GithubTokenContext.Provider>
  );
}

GithubTokenProvider.propTypes = {
  children: node.isRequired,
  authResult: shape({ user: shape({}), provider: string }).isRequired,
};

export { GithubTokenProvider, useGithubToken };
