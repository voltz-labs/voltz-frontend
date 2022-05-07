import { Button, Container } from "react-bootstrap";
import { Page } from "../../components/Page";
import { getTezosBalance } from "../../functions/getTezosBalance";
import { gql } from "../../functions/gql";
import { graphql } from "../../functions/graphql";
import { useAuth } from "../../hooks/useAuth";
import { useHandler } from "../../hooks/useHandler";
import { GraphQLError } from "../../utils/GraphQLError";
import { wallet } from "../../utils/wallet";
import styles from "./ConnectYourWallet.module.scss";

export const MUTATION_USER_CONNECT = gql`
  mutation ($input: UserConnectInput!) {
    userConnect(input: $input) {
      address
      publicKey
    }
  }
`;

export const ConnectYourWallet = () => {
  const { setUser } = useAuth();

  const { handler } = useHandler();

  const connectWallet = handler(async () => {
    const permissions = await wallet.client.requestPermissions();

    if (permissions) {
      const { errors } = await graphql({
        query: MUTATION_USER_CONNECT,
        variables: {
          input: {
            address: permissions.address,
            publicKey: permissions.publicKey,
          },
        },
      });

      if (errors) {
        throw new GraphQLError("Failed to connect wallet", errors);
      }

      const balance = await getTezosBalance(permissions.address);

      setUser({
        address: permissions.address,
        publicKey: permissions.publicKey,
        balance,
      });
    }
  });

  return (
    <Page title="Dashboard">
      <Container
        className={`my-5 d-flex align-items-center justify-content-center ${styles["container"]}`}
      >
        <Button variant="primary" size="lg" onClick={connectWallet}>
          Connect Your Wallet
        </Button>
      </Container>
    </Page>
  );
};
