import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import { useAuth } from "./hooks/useAuth";
import { Loading } from "./pages/Loading";
import { ConnectYourWallet } from "./pages/ConnectYourWallet";
import { Dashboard } from "./pages/Dashboard";
import { UserContextProvider } from "./contexts/UserContext";

export const Router = () => {
  const { loading, user } = useAuth();

  return (
    <BrowserRouter>
      {loading ? (
        <Routes>
          <Route path="*" element={<Loading />} />
        </Routes>
      ) : user ? (
        <UserContextProvider user={user}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </UserContextProvider>
      ) : (
        <Routes>
          <Route path="/" element={<ConnectYourWallet />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};
