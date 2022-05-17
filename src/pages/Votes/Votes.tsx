import { Button, Table } from "react-bootstrap";
import { Page } from "../../components/Page";
import { PageFallback } from "../../components/PageFallback";
import { PageTitle } from "../../components/PageTitle";
import { PageTitleText } from "../../components/PageTitleText";
import { useRouter } from "../../hooks/useRouter";
import { useQueryVotes } from "./hooks/useQueryVotes";

export const Votes = () => {
  const router = useRouter();

  const Q = useQueryVotes();

  if (Q.fallback) {
    return <PageFallback title="Votes" loading={Q.loading} errors={Q.errors} />;
  }

  const {
    data: { votes },
  } = Q;

  return (
    <Page title="Votes">
      <PageTitle>
        <PageTitleText>Votes</PageTitleText>
      </PageTitle>
      <Table hover responsive>
        <thead>
          <tr>
            <th>Vote ID</th>
            <th>Poll</th>
            <th>Option</th>
            <th>Voter</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {votes.items.map((vote) => (
            <tr key={vote.voteId}>
              <td>{vote.voteId}</td>
              <td>{vote.poll.title}</td>
              <td>{vote.option.description}</td>
              <td>{vote.voter.address}</td>
              <td>
                <Button
                  size="sm"
                  onClick={() => {
                    router.push({
                      path: `/votes/${vote.voteId}`,
                    });
                  }}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Page>
  );
};
