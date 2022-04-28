import { Fallback } from "../../components/Fallback";
import { Page } from "../../components/Page";
import { RecentPolls } from "./components/RecentPolls";
import { RecentVotes } from "./components/RecentVotes";
import { useQueryDashboard } from "./hooks/useQueryDashboard";

export const Dashboard = () => {
  const Q = useQueryDashboard();

  if (Q.fallback) {
    return (
      <Page title="Dashboard">
        <Fallback loading={Q.loading} errors={Q.errors} />
      </Page>
    );
  }

  const {
    data: { polls, votes },
  } = Q;

  return (
    <Page title="Dashboard">
      <RecentPolls polls={polls.items} />
      <RecentVotes votes={votes.items} />
    </Page>
  );
};
