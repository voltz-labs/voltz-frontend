import { Table } from "react-bootstrap";

export interface RecentVotesProps {
  votes: {
    voteId: string;
    poll: {
      title: string;
    };
    option: {
      description: string;
    };
    voter: {
      address: string;
    };
  }[];
}

export const RecentVotes = ({ votes }: RecentVotesProps) => {
  return (
    <div>
      <h2 className="border-bottom">Recent Votes</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Poll</th>
            <th>Option</th>
            <th>Voter</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((vote) => (
            <tr key={vote.voteId}>
              <td>{vote.poll.title}</td>
              <td>{vote.option.description}</td>
              <td>{vote.voter.address}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
