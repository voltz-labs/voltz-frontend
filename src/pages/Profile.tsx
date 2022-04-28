import { Button } from "react-bootstrap";
import { Page } from "../components/Page";
import { UserProps } from "../models/User";

export interface ProfileProps {
  user: UserProps;
  onDisconnect: () => void;
}

export const Profile = ({ user, onDisconnect }: ProfileProps) => {
  return (
    <Page title="Profile">
      <div className="d-flex flex-column align-items-center text-center">
        <img
          src={`https://services.tzkt.io/v1/avatars/${user.address}`}
          alt="Avatar"
          className="rounded-circle"
          width="150"
        />
        <div className="mt-3">
          <p className="text-muted mb-1">Address</p>
          <p>{user.address}</p>
          <p className="text-muted mb-1">Public Key</p>
          <p className="font-size-sm">{user.publicKey}</p>
          <p className="text-muted mb-1">Balance</p>
          <p className="font-size-sm">{user.balance}</p>
          <Button variant="primary" onClick={() => onDisconnect()}>
            Disconnect
          </Button>
        </div>
      </div>
    </Page>
  );
};
