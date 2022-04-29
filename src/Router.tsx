import { BrowserRouter } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";
import { Profile } from "./pages/UserRoutes/Profile";
import { Loading } from "./pages/Loading";
import { CreatePoll } from "./pages/UserRoutes/CreatePoll";
import { PollVote } from "./pages/UserRoutes/PollVote";
import { Vote } from "./pages/Vote";
import { Polls } from "./pages/UserRoutes/Polls";
import { Votes } from "./pages/UserRoutes/Votes";
import { UserRoutes } from "./routes/UserRoutes";

export const Router = () => {
  const { loading, user, setUser } = useAuth();

  return (
    <BrowserRouter>
      {loading ? (
        <Routes>
          <Route path="*" element={<Loading />} />
        </Routes>
      ) : user ? (
        <UserRoutes user={user} setUser={setUser} />
      ) : (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {user ? (
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/polls" element={<Polls />} />
              <Route path="/polls/new" element={<CreatePoll />} />
              <Route path="/polls/:pollId/vote" element={<PollVote />} />
              <Route path="/votes" element={<Votes />} />
              <Route path="/votes/:voteId" element={<Vote />} />
            </>
          ) : (
            <Route path="/profile" element={<Navigate to="/" />} />
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};
