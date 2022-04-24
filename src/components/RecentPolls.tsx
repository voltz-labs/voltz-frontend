import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

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
  }[];
}

export const RecentPolls = ({ polls }: RecentPollsProps) => {
  return (
    <div>
      <h2 className="border-bottom">Recent Polls</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Options</th>
            <th>Creator</th>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
