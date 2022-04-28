import { PropsWithChildren } from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Navbar } from "./Navbar";

export interface PageProps {
  title: string;
}

export const Page = ({ title, children }: PropsWithChildren<PageProps>) => {
  return (
    <>
      <Helmet>
        <title>{`Voltz • ${title}`}</title>
      </Helmet>
      <header className="mb-5">
        <Navbar />
      </header>
      <main>
        <Container>{children}</Container>
      </main>
      <footer className="mb-3">
        <Container>
          <div className="text-center text-muted">
            Voltz &mdash; &copy; 2022
          </div>
        </Container>
      </footer>
    </>
  );
};
