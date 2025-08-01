import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./hooks/useRoutes";
import Snackbar from "./components/shared/snackbar/Snackbar";

function App() {
  const routes = useRoutes();

  return (
    <>
      <BrowserRouter>{routes}</BrowserRouter>
      <Snackbar />
    </>
  );
}

export default App;
