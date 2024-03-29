import React, { createContext, useContext, useMemo } from "react";
import { node, string } from "prop-types";

import { ApolloProvider } from "@apollo/client";

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
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </GithubClientContext.Provider>
  );
}

GithubClientProvider.propTypes = {
  children: node.isRequired,
  accessToken: string.isRequired,
};

export { GithubClientProvider, useGithubClient };
