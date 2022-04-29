import { Button } from "react-bootstrap";
import { Page } from "../components/Page";
import { useHandler } from "../hooks/useHandler";
import { useUser } from "../hooks/useUser";

export const Profile = () => {
  const { user, disconnect } = useUser();

  const { handler } = useHandler();

  const onDisconnect = handler(async () => {
    await disconnect(user);
  });

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
          <Button variant="primary" onClick={onDisconnect}>
            Disconnect
          </Button>
        </div>
      </div>
    </Page>
  );
};
