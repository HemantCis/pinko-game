import { useState, useEffect } from "react";
import DimensionsContext from "./dimensions";

export default function DimensionsProvider({ children }: any) {
  const [dimensions, setDimensions] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const handleResize = () => {
    setDimensions({ x: window.innerWidth, y: window.innerHeight });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, false);
  }, []);

  return (
    <DimensionsContext.Provider value={dimensions}>
      {children}
    </DimensionsContext.Provider>
  );
}
