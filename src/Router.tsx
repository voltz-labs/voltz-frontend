import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import { useAuth } from "./hooks/useAuth";
import { Loading } from "./pages/Loading";
import { ConnectYourWallet } from "./pages/ConnectYourWallet";

export const Router = () => {
  const { loading, user, setUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {loading ? (
          <Route path="*" element={<Loading />} />
        ) : user ? (
          <Route />
        ) : (
          <Route path="/" element={<ConnectYourWallet />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};
