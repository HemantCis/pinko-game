import { initPlinkoSocket } from "./plinko";

export const initSocket = (socket: any, io: any, req: any) => {
  initPlinkoSocket(socket, io, req);
};
