import { Button, Table } from "react-bootstrap";
import { Fallback } from "../../../components/Fallback";
import { Page } from "../../../components/Page";
import { PageTitle } from "../../../components/PageTitle";
import { PageTitleText } from "../../../components/PageTitleText";
import { useRouter } from "../../../hooks/useRouter";
import { useQueryPolls } from "./hooks/useQueryPolls";

export const Polls = () => {
  const router = useRouter();

  const Q = useQueryPolls();

  if (Q.fallback) {
    return (
      <Page title="Dashboard">
        <Fallback loading={Q.loading} errors={Q.errors} />
      </Page>
    );
  }

  const {
    data: { polls },
  } = Q;

  return (
    <Page title="Polls">
      <PageTitle>
        <PageTitleText>Polls</PageTitleText>
        <div>
          <Button
            onClick={() => {
              router.push({
                path: "/polls/new",
              });
            }}
          >
            New
          </Button>
        </div>
      </PageTitle>
      <Table hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Creator</th>
            <th>Status</th>
            <th className="text-end">Minimal Balance</th>
            <th className="text-end">Expiration Date</th>
            <th className="text-end">Expiration Block Quote</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {polls.items.map((poll) => (
            <tr key={poll.pollId}>
              <td>{poll.title}</td>
              <td>{poll.creator.address}</td>
              <td>
                {poll.expired ? (
                  <span className="badge bg-danger">Closed</span>
                ) : (
                  <span className="badge bg-success">Open</span>
                )}
              </td>
              <td className="text-end">
                <span>
                  {poll.minimalBalanceRequiredToVote
                    ? poll.minimalBalanceRequiredToVote.toFixed(6)
                    : "N/A"}
                </span>
              </td>
              <td className="text-end">
                {poll.expirationDate
                  ? new Date(poll.expirationDate).toLocaleString()
                  : "N/A"}
              </td>
              <td className="text-end">
                {poll.expirationBlockQuote
                  ? new Intl.NumberFormat().format(poll.expirationBlockQuote)
                  : "N/A"}
              </td>
              <td>
                <Button
                  size="sm"
                  onClick={() => {
                    router.push({
                      path: `/polls/${poll.pollId}`,
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
