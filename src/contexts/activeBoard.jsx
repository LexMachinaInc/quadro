import React, { createContext, useContext, useState, useMemo } from "react";
import { node } from "prop-types";
import { useRepoInfo } from "./githubRepoInfo";

const ActiveBoardContext = createContext();

const useActiveBoard = () => useContext(ActiveBoardContext);

function ActiveBoardProvider({ children }) {
  const defaultActiveBoardState = {
    activeBoardName: null,
    //setActiveBoardName: () => {},
  };
  //const { member: defaultBoard } = useRepoInfo();
  const [activeBoardState, setActiveBoardState] = useState(
    defaultActiveBoardState,
  );
  const activeBoardMethods = {
    setActiveBoardName: (newName) => {
      setActiveBoardState({ ...activeBoardState, activeBoardName: newName });
    },
  };
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ActiveBoardContext.Provider value={{
      activeBoardState,
      activeBoardMethods,
    }}>
      <ActiveBoardProvider>{children}</ActiveBoardProvider>
    </ActiveBoardContext.Provider>
  );
}

ActiveBoardProvider.propTypes = {
  children: node.isRequired,
};

export { ActiveBoardProvider, useActiveBoard };
