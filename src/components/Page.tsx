import { PropsWithChildren } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { NavBar } from "./Navbar";
import { BsGithub, BsTelegram, BsTwitter } from "react-icons/bs";

export interface PageProps {
  title: string;
}

export const Page = ({ title, children }: PropsWithChildren<PageProps>) => {
  return (
    <div className="page">
      <Helmet>
        <title>{`Voltz • ${title}`}</title>
      </Helmet>
      <header>
        <NavBar />
      </header>
      <main className="bg-light">
        <Container className="h-100">{children}</Container>
      </main>
      <footer className="py-3 bg-dark text-light">
        <Container>
          <Row>
            <Col>
              <div className="text-center">
                <span>
                  This is currently the Voltz proof of concept, and the beta
                  version at that. Source code available at{" "}
                  <a
                    href="https://github.com/voltz-labs/voltz-frontend"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                  .
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="py-2 d-flex flex-direction-column align-items-center justify-content-center gap-3">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/voltz-labs/voltz-frontend"
                  title="GitHub"
                >
                  <BsGithub />
                  <span className="visually-hidden">GitHub</span>
                </a>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://twitter.com/"
                  title="Telegram"
                >
                  <BsTelegram />
                  <span className="visually-hidden">Telegram</span>
                </a>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://web.telegram.org/"
                  title="Twitter"
                >
                  <BsTwitter />
                  <span className="visually-hidden">Twitter</span>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};
