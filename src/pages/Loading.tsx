import { Page } from "../components/Page";
import { PageTitle } from "../components/PageTitle";
import { PageTitleText } from "../components/PageTitleText";

export const Loading = () => {
  return (
    <Page title="Loading">
      <PageTitle>
        <PageTitleText>Loading...</PageTitleText>
      </PageTitle>
    </Page>
  );
};
