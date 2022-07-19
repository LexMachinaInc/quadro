import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { node, shape, string } from "prop-types";
import { DASHBOARD_DATA, getApolloClient } from "../helpers/api_interface";
import CONFIG from "../config/api";
import { useGithubClient } from "./githubClient";

/**
 * The React Context object for github token
 */
const GithubRepoInfoContext = createContext({});

const useRepoInfo = () => useContext(GithubRepoInfoContext);

function GithubRepoInfoProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState("");
  const [members, setMembers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [userAvatar, setUserAvatar] = useState("");

  const client = useGithubClient();

  useEffect(() => {
    client
      .query({
        query: DASHBOARD_DATA,
        variables: { owner: CONFIG.owner, repo: CONFIG.repo },
      })
      .then((result) => {
        const {
          viewer: { login: loginMember, avatarUrl: avatar },
          repository: {
            labels: { nodes: statusLabels },
            assignableUsers: { nodes: lookedUpmembers },
          },
        } = result.data;
        setLoading(false);
        setMember(loginMember);
        setMembers(lookedUpmembers);
        setLabels(statusLabels);
        setUserAvatar(avatar);
      });
  }, [client]);

  const value = useMemo(
    () => ({ loading, member, members, labels, userAvatar }),
    [loading, member, members, labels, userAvatar],
  );
  return (
    <GithubRepoInfoContext.Provider value={value}>
      {children}
    </GithubRepoInfoContext.Provider>
  );
}

GithubRepoInfoProvider.propTypes = {
  children: node.isRequired,
};

export { GithubRepoInfoProvider, useRepoInfo };
