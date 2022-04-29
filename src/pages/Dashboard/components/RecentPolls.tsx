import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PollType } from "../../../@types/PollType";

export interface RecentPollsProps {
  polls: {
    pollId: string;
    title: string;
    description: string;
    creator: {
      address: string;
    };
    options: {
      optionId: string;
      description: string;
    }[];
    expired: boolean;
    pollType: PollType;
  }[];
}

export const RecentPolls = ({ polls }: RecentPollsProps) => {
  return (
    <div>
      <h2 className="border-bottom">Recent Polls</h2>
      <Table hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Options</th>
            <th>Creator</th>
            <th>Status</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <tr key={poll.pollId}>
              <td>
                <Link to={`/polls/${poll.pollId}`}>{poll.title}</Link>
              </td>
              <td>{poll.description}</td>
              <td>
                {poll.options.map((option) => option.description).join(" · ")}
              </td>
              <td>{poll.creator.address}</td>
              <td>
                {poll.expired ? (
                  <span className="badge bg-danger">Closed</span>
                ) : (
                  <span className="badge bg-success">Open</span>
                )}
              </td>
              <td>{poll.pollType === "USER_BALANCE" ? "Balance" : "Vote"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
