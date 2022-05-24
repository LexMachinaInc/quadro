import React, { createContext, useContext, useMemo } from "react";
import { shape, node, string } from "prop-types";

import { GithubAuthProvider } from "firebase/auth";
import { getApolloClient } from "../helpers/api_interface";

/**
 * The React Context object for github token
 */
const GithubClientContext = createContext({});

const useGithubClient = () => useContext(GithubClientContext);

function GithubClientProvider({ children, authResult }) {
  const credential = GithubAuthProvider.credentialFromResult(authResult);
  const { accessToken } = credential;
  const client = useMemo(() => getApolloClient(accessToken), [accessToken]);
  return (
    <GithubClientContext.Provider value={client}>
      {children}
    </GithubClientContext.Provider>
  );
}

GithubClientProvider.propTypes = {
  children: node.isRequired,
  authResult: shape({ user: shape({}), provider: string }).isRequired,
};

export { GithubClientProvider, useGithubClient };
