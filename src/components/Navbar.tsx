import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export const NavBar = () => {
  const { loading, user, connect } = useAuth();

  const { disconnect } = useUser();

  return (
    <Navbar
      bg="light"
      variant="light"
      className="text-light fs-4 fw-bold shadow-sm"
      expand="lg"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            alt="Logo"
            src="/logo-wide.svg"
            width="180"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar" />

        <Navbar.Collapse id="navbar">
          <Nav className="w-100">
            {loading ? null : user ? (
              <>
                {user.isAdmin && (
                  <Nav.Link as={NavLink} to="/whitelists">
                    Whitelists
                  </Nav.Link>
                )}
                <Nav.Link
                  className="d-block d-lg-none"
                  as={NavLink}
                  to="/profile"
                >
                  Profile
                </Nav.Link>
                <Nav.Link className="d-block d-lg-none" onClick={disconnect}>
                  Disconnect
                </Nav.Link>
                <NavDropdown
                  className="ms-lg-auto d-none d-lg-block"
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
                  <NavDropdown.Item onClick={disconnect}>
                    Disconnect
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Item className="ms-auto">
                <Button variant="primary" onClick={connect}>
                  Connect
                </Button>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
