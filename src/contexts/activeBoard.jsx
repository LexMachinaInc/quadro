import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { node } from "prop-types";
import { useRepoInfo } from "./githubRepoInfo";

const ActiveBoardContext = createContext();

const useActiveBoard = () => useContext(ActiveBoardContext);

function ActiveBoardProvider({ children }) {
  const { member } = useRepoInfo();
  const [activeBoard, setActiveBoard] = useState("");
  const value = useMemo(() => ({ activeBoard, setActiveBoard }), [activeBoard]);

  useEffect(() => {
    if (activeBoard === "") {
      setActiveBoard(member);
    }
  }, [member]);

  return (
    <ActiveBoardContext.Provider value={value}>
      {children}
    </ActiveBoardContext.Provider>
  );
}

ActiveBoardProvider.propTypes = {
  children: node.isRequired,
};

export { ActiveBoardProvider, useActiveBoard };
