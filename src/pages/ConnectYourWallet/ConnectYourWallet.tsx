import { Button, Container } from "react-bootstrap";
import { Page } from "../../components/Page";
import { gql } from "../../functions/gql";
import { useAuth } from "../../hooks/useAuth";

export const MUTATION_USER_CONNECT = gql`
  mutation ($input: UserConnectInput!) {
    userConnect(input: $input) {
      address
      publicKey
    }
  }
`;

export const ConnectYourWallet = () => {
  const { connect } = useAuth();

  return (
    <Page title="Dashboard">
      <Container className="h-100 d-flex align-items-center justify-content-center pb-5">
        <Button variant="primary" size="lg" onClick={connect}>
          Connect Your Wallet
        </Button>
      </Container>
    </Page>
  );
};
