import { Link } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div>
      <Link to="/polls">Polls</Link>
      <Link to="/polls/new">Create Poll</Link>
      <Link to="/polls/1">Poll</Link>
    </div>
  );
};
