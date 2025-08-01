import { useState } from "react";
import { PlinkoContext } from "./plinko";

export default function PlinkoProvider({ children }: any) {
  const [gameData, setGameData] = useState(null);
  return (
    <PlinkoContext.Provider
      value={{
        gameData,
        setGameData,
      }}
    >
      {children}
    </PlinkoContext.Provider>
  );
}
