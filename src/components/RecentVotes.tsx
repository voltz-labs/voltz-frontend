import { Link } from "react-router-dom";

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
    <div className="my-3 p-3 bg-white rounded box-shadow">
      <h6 className="border-bottom border-gray pb-2 mb-0">Recent votes</h6>
      {votes.map((vote) => (
        <div className="media text-muted pt-3">
          <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <Link to={`/votes/${vote.voteId}`}>
              <strong className="d-block text-gray-dark">
                {vote.poll.title}
              </strong>
            </Link>
            <p>Option: {vote.option.description}</p>
            <p>By: {vote.voter.address}</p>
          </p>
        </div>
      ))}
    </div>
  );
};
