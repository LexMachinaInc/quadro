import React, { createContext, useContext, useMemo } from "react";
import { shape, node, string } from "prop-types";

import { GithubAuthProvider } from "firebase/auth";
import { getApolloClient } from "../helpers/api_interface";

/**
 * The React Context object for github token
 */
const GithubClientContext = createContext({});

const useGithubClient = () => useContext(GithubClientContext);

function GithubClientProvider({ children, accessToken }) {
  const client = useMemo(() => getApolloClient(accessToken), [accessToken]);
  return (
    <GithubClientContext.Provider value={client}>
      {children}
    </GithubClientContext.Provider>
  );
}

GithubClientProvider.propTypes = {
  children: node.isRequired,
  accessToken: string.isRequired,
};

export { GithubClientProvider, useGithubClient };
