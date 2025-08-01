import React from "react";

interface ISocketContext {
  socket: any;
  socketId: any;
  cleanUp: () => void;
  connect: () => void;
  plinkoGame: (lines: any, betValue: number, mode: any, device: string) => void;
}

export const SocketContext = React.createContext<ISocketContext>({
  socket: null,
  socketId: null,
  cleanUp: () => null,
  connect: () => null,
  plinkoGame: () => null,
});
