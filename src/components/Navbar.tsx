import {
  Navbar as BSNavbar,
  Container,
  Nav,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql } from "../functions/gql";
import { graphql } from "../functions/graphql";
import { useAuth } from "../hooks/useAuth";
import { useHandler } from "../hooks/useHandler";
import { GraphQLError } from "../utils/GraphQLError";
import { wallet } from "../utils/wallet";
import { getTezosBalance } from "../functions/getTezosBalance";

export interface MutationUserConnect {}

export interface MutationUserConnectVariables {}

export const MUTATION_USER_CONNECT = gql`
  mutation ($input: UserConnectInput!) {
    userConnect(input: $input) {
      address
      publicKey
    }
  }
`;

export const Navbar = () => {
  const { user, setUser } = useAuth();

  const { handler } = useHandler();

  const connectWallet = handler(async () => {
    const permissions = await wallet.client.requestPermissions();

    if (permissions) {
      const { errors } = await graphql<
        MutationUserConnect,
        MutationUserConnectVariables
      >({
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

  const disconnectWallet = handler(async () => {
    setUser(null);

    await wallet.clearActiveAccount();
  });

  return (
    <BSNavbar bg="primary" variant="dark" className="text-light">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          <img
            alt="Logo"
            src="https://react-bootstrap.netlify.app/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Voltz
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/polls/new">
              New Poll
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
        <Nav>
          {user ? (
            <NavDropdown
              title={
                <img
                  alt="Avatar"
                  src={`https://services.tzkt.io/v1/avatars/${user.address}`}
                  width="30"
                  height="30"
                  className="rounded-circle"
                />
              }
            >
              <NavDropdown.Item as={Link} to="/profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={disconnectWallet}>
                Disconnect
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Item>
              <Button variant="primary" onClick={connectWallet}>
                Connect
              </Button>
            </Nav.Item>
          )}
        </Nav>
      </Container>
    </BSNavbar>
  );
};
