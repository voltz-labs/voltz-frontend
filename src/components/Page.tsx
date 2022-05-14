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
          <div className="text-center">Voltz &mdash; &copy; 2022</div>
        </Container>
      </footer>
    </div>
  );
};
