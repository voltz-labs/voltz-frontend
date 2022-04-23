import {
  Navbar as BSNavbar,
  Container,
  Nav,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { wallet } from "../utils/wallet";

export const Navbar = () => {
  const { user, setUser } = useAuth();

  const connectWallet = async () => {
    const permissions = await wallet.client.requestPermissions();

    if (permissions) {
      setUser({
        address: permissions.address,
        publicKey: permissions.publicKey,
      });
    }
  };

  const disconnectWallet = async () => {
    setUser(null);

    await wallet.clearActiveAccount();
  };

  return (
    <BSNavbar bg="light" variant="light" className="text-light">
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
        <Nav>
          {user ? (
            <NavDropdown
              title={
                <img
                  alt="Avatar"
                  src={`https://services.tzkt.io/v1/avatars/${user.address}`}
                  width="40"
                  height="40"
                  className="rounded-circle"
                />
              }
            >
              <NavDropdown.Item onClick={disconnectWallet}>
                Logout
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
