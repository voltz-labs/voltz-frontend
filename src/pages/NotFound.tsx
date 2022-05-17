import { Link } from "react-router-dom";
import { Page } from "../components/Page";
import { PageContainer } from "../components/PageContainer";
import { PageTitle } from "../components/PageTitle";
import { PageTitleText } from "../components/PageTitleText";

export const NotFound = () => {
  return (
    <Page title="Not Found">
      <PageTitle>
        <PageTitleText>Not Found</PageTitleText>
      </PageTitle>
      <PageContainer>
        <p>We're sorry, but we couldn't found the page you are looking for.</p>
        <Link to="/">Return to Dashboard</Link>
      </PageContainer>
    </Page>
  );
};
