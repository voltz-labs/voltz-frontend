import { Route, Routes } from "react-router";
import { UserContextProvider } from "../contexts/UserContext";
import { useHandler } from "../hooks/useHandler";
import { UserProps } from "../models/User";
import { CreatePoll } from "../pages/CreatePoll";
import { Polls } from "../pages/Polls";
import { PollVote } from "../pages/PollVote";
import { Profile } from "../pages/Profile";
import { Vote } from "../pages/Vote";
import { Votes } from "../pages/Votes";
import { wallet } from "../utils/wallet";

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
    path: "/polls/:pollId/vote",
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
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </UserContextProvider>
  );
};
