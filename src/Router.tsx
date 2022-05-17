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
import { Polls } from "./pages/Polls";
import { Votes } from "./pages/Votes";
import { PollCreate } from "./pages/PollCreate";
import { PollVote } from "./pages/PollVote";
import { Vote } from "./pages/Vote";

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
            {user.isAdmin && (
              <>
                <Route path="/whitelists" element={<WhitelistList />} />
                <Route path="/whitelists/new" element={<WhitelistCreate />} />
              </>
            )}
            <Route path="/polls" element={<Polls />} />
            <Route path="/polls/new" element={<PollCreate />} />
            <Route path="/polls/:pollId" element={<PollVote />} />
            <Route path="/votes" element={<Votes />} />
            <Route path="/votes/:voteId" element={<Vote />} />
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
