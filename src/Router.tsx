import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import { Profile } from "./pages/Profile";
import { wallet } from "./utils/wallet";
import { Loading } from "./pages/Loading";
import { CreatePoll } from "./pages/CreatePoll";
import { PollVote } from "./pages/PollVote";
import { Vote } from "./pages/Vote";
import { Polls } from "./pages/Polls";
import { Votes } from "./pages/Votes";

export const Router = () => {
  const { loading, user, setUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {loading ? (
          <Route path="*" element={<Loading />} />
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            {user ? (
              <>
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
                <Route path="/polls" element={<Polls />} />
                <Route path="/polls/new" element={<CreatePoll user={user} />} />
                <Route
                  path="/polls/:pollId/vote"
                  element={<PollVote user={user} />}
                />
                <Route path="/votes" element={<Votes />} />
                <Route path="/votes/:voteId" element={<Vote />} />
              </>
            ) : (
              <Route path="/profile" element={<Navigate to="/" />} />
            )}

            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};
