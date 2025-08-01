import Providers from "./context/Providers";
import App from "./App";
import { RecoilRoot } from "recoil";

export default function AppWrapper() {
  return (
    <RecoilRoot>
      <Providers>
        <App />
      </Providers>
    </RecoilRoot>
  );
}
