import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import { Loading } from "./components/Loading";

export const Router = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
