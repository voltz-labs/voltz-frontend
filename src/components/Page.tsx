import { PropsWithChildren } from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { NavBar } from "./Navbar";

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
          <div className="text-center">
            <span>
              This is currently the Voltz proof of concept, and the alpha
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
        </Container>
      </footer>
    </div>
  );
};
