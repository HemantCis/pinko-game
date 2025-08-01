import { Routes, Route } from "react-router-dom";
import PlinkoPage from "../pages/PlinkoPage";

export const useRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PlinkoPage />} />
    </Routes>
  );
};
