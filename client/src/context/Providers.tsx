import DimensionsProvider from "./dimensions/DimensionsProvider";
import PlinkoProvider from "./plinko/PlinkoProvider";
import { SocketProvider } from "./socket/SocketProvider";

export default function Providers({ children }: any) {
  return (
    <DimensionsProvider>
      <PlinkoProvider>
        <SocketProvider>{children}</SocketProvider>
      </PlinkoProvider>
    </DimensionsProvider>
  );
}
