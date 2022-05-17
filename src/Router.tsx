import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./hooks/useAuth";
import { Loading } from "./pages/Loading";
import { ConnectYourWallet } from "./pages/ConnectYourWallet";
import { Dashboard } from "./pages/Dashboard";
import { UserContextProvider } from "./contexts/UserContext";
import { NotFound } from "./pages/NotFound";
import { WhitelistList } from "./pages/WhitelistList";
import { Profile } from "./pages/Profile";
import { WhitelistCreate } from "./pages/WhitelistCreate";

export const Router = () => {
  const { loading, user } = useAuth();

  console.log(user);

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
            {user.isAdmin && (
              <>
                <Route path="/whitelists" element={<WhitelistList />} />
                <Route path="/whitelists/new" element={<WhitelistCreate />} />
              </>
            )}
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserContextProvider>
      ) : (
        <Routes>
          <Route path="/" element={<ConnectYourWallet />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};
