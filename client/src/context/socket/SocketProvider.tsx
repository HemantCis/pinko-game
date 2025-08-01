import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { SocketContext } from "./socket";
import { useSnackbar } from "../../hooks/useSnackbar";
import { PlinkoContext } from "../plinko/plinko";

export function SocketProvider({ children }: any) {
  const [socket, setSocket] = useState<any>(null);
  const [socketId, setSocketId] = useState(null);
  const plinkoAPI = useContext(PlinkoContext);
  const { notify } = useSnackbar();

  useEffect(() => {
    connect();
    // window.addEventListener("beforeunload", cleanUp);
    // window.addEventListener("beforeclose", cleanUp);
    // return () => cleanUp();
    // eslint-disable-next-line
  }, []);

  function cleanUp() {
    // window.socket && window.socket.emit("disconnect");
    window.socket && window.socket.close();
    setSocket(null);
    setSocketId(null);
  }

  async function connect() {
    const SOCKET_URL = window.location.host.includes(":")
      ? window.location.protocol === "http:"
        ? `ws://${window.location.hostname}:${process.env.REACT_APP_PORT}/`
        : `wss://${window.location.hostname}:${process.env.REACT_APP_PORT}`
      : window.location.protocol === "http:"
      ? `ws://${window.location.host}/`
      : `wss://${window.location.host}/`;

    // const socket = io('http://localhost:5001/', {
    //   transports: ["polling"],
    //   upgrade: false,
    // });

    const socket = io('https://plinkoapi.novobet.io/', {
      transports: ["polling"],
      upgrade: false,
    });

    registerCallbacks(socket);
    setSocket(socket);
    window.socket = socket;
    return socket;
  }

  // PLINKO FUNCTIONS
  function plinkoGame(
    lines: any,
    betValue: number,
    mode: any,
    device: string
  ) {
    window.socket.emit("plinkoGame", { lines, mode, betValue, device });
  }

  function registerCallbacks(socket: any) {
    socket.on("plinkoGame", (data: any) => {
      plinkoAPI.setGameData(data);
    });

    socket.on("failedPlinko", (data: any) => {
      // notify(data.msg, "error");
    });
  }

  return (
    <SocketContext.Provider
      value={{
        connect,
        socket,
        socketId,
        cleanUp,
        plinkoGame
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
