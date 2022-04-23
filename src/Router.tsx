import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import { Loading } from "./components/Loading";
import { Profile } from "./pages/Profile";
import { wallet } from "./utils/wallet";

export const Router = () => {
  const { loading, user, setUser } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {user ? (
          <Route
            path="/profile"
            element={
              <Profile
                user={user}
                onDisconnect={async () => {
                  setUser(null);

                  await wallet.clearActiveAccount();
                }}
              />
            }
          />
        ) : (
          <Route path="/profile" element={<Navigate to="/" />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
