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
    };
  }[];
}

export const RecentPolls = ({ polls }: RecentPollsProps) => {
  return (
    <div className="my-3 p-3 bg-white rounded box-shadow">
      <h6 className="border-bottom border-gray pb-2 mb-0">Recent polls</h6>
      {polls.map((poll) => (
        <div className="media text-muted pt-3">
          <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <Link to={`/polls/${poll.pollId}`}>
              <strong className="d-block text-gray-dark">{poll.title}</strong>
            </Link>
            {poll.description}
          </p>
        </div>
      ))}
    </div>
  );
};
