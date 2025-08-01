import React from "react";

interface IPlinkoContext {
  gameData: any;
  setGameData: any;
}

export const PlinkoContext = React.createContext<IPlinkoContext>({
  gameData: null,
  setGameData: () => null,
});
