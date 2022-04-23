import { Navbar } from "../components/Navbar";
import { Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { SignPayload } from "../components/SignPayload";
import { VerifyPayload } from "../components/VerifyPayload";

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />

      {user ? (
        <Container className="px-4 py-5">
          <h1 className="pb-2 mb-3 border-bottom">Voltz Demo</h1>
          <Row>
            <Col>
              <SignPayload user={user} />
            </Col>
            <Col>
              <VerifyPayload />
            </Col>
          </Row>
        </Container>
      ) : null}
    </div>
  );
};
