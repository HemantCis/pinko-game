import { createContext } from "react";

interface IDimensionsContext {
  x: number;
  y: number;
}

const DimensionsContext = createContext<IDimensionsContext>({
  x: 0,
  y: 0,
});

export default DimensionsContext;
