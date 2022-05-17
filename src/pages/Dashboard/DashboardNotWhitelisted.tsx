import { Page } from "../../components/Page";
import { PageTitle } from "../../components/PageTitle";
import { PageTitleText } from "../../components/PageTitleText";
import { useUser } from "../../hooks/useUser";

export const DashboardNotWhitelisted = () => {
  const { user } = useUser();

  return (
    <Page title="Dashboard">
      <PageTitle>
        <PageTitleText>Dashboard</PageTitleText>
      </PageTitle>
      <div>
        <p>
          We're sorry, but your user address <code>{user.address}</code> is not
          in our whitelisted users.
        </p>
        <p>
          Thanks for your interest in our app, contact us via{" "}
          <a href="mailto:voltz.live@protonmail.com">email</a>{" "}
          (voltz.live@protonmail.com) to get allowed into the beta
          proof-of-concept.
        </p>
      </div>
    </Page>
  );
};
