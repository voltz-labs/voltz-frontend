import { Link } from "react-router-dom";
import { wallet } from "../utils/wallet";

export const Dashboard = () => {
  const connect = async () => {
    const permissions = await wallet.client.requestPermissions();

    console.log(permissions);
  };

  return (
    <div>
      <button onClick={connect}>Connect</button>
      <Link to="/polls">Polls</Link>
      <Link to="/polls/new">Create Poll</Link>
      <Link to="/polls/1">Poll</Link>
    </div>
  );
};
