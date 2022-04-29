import { Route, Routes } from "react-router";
import { UserContextProvider } from "../contexts/UserContext";
import { useHandler } from "../hooks/useHandler";
import { UserProps } from "../models/User";
import { CreatePoll } from "../pages/UserRoutes/CreatePoll";
import { Polls } from "../pages/UserRoutes/Polls";
import { PollVote } from "../pages/UserRoutes/PollVote";
import { Profile } from "../pages/UserRoutes/Profile";
import { Vote } from "../pages/Vote";
import { Votes } from "../pages/UserRoutes/Votes";
import { wallet } from "../utils/wallet";
import { Dashboard } from "../pages/Dashboard";

const routes = [
  {
    path: "/polls",
    component: Polls,
  },
  {
    path: "/polls/new",
    component: CreatePoll,
  },
  {
    path: "/polls/:pollId",
    component: PollVote,
  },
  {
    path: "/votes",
    component: Votes,
  },
  {
    path: "/votes/:voteId",
    component: Vote,
  },
  {
    path: "/profile",
    component: Profile,
  },
];

export interface UserRoutesProps {
  user: UserProps;
  setUser: (user: UserProps | null) => void;
}

export const UserRoutes = ({ user, setUser }: UserRoutesProps) => {
  const { handler } = useHandler();

  const disconnect = handler(async () => {
    setUser(null);

    try {
      await wallet.clearActiveAccount();
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <UserContextProvider user={user} disconnect={disconnect}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </UserContextProvider>
  );
};
