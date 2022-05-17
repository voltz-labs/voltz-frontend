import { Page } from "../../components/Page";
import { PageContainer } from "../../components/PageContainer";
import { PageFallback } from "../../components/PageFallback";
import { PageTitle } from "../../components/PageTitle";
import { PageTitleText } from "../../components/PageTitleText";
import { RecentPolls } from "./components/RecentPolls";
import { RecentVotes } from "./components/RecentVotes";
import { useQueryDashboard } from "./hooks/useQueryDashboard";

export const DashboardWhitelisted = () => {
  const Q = useQueryDashboard();

  if (Q.fallback) {
    return (
      <PageFallback title="Dashboard" errors={Q.errors} loading={Q.loading} />
    );
  }
  const {
    data: { polls, votes },
  } = Q;

  return (
    <Page title="Dashboard">
      <PageTitle>
        <PageTitleText>Dashboard</PageTitleText>
      </PageTitle>
      <PageContainer>
        <RecentPolls polls={polls.items} />
        <RecentVotes votes={votes.items} />
      </PageContainer>
    </Page>
  );
};
