import { Fallback } from "./Fallback";
import { Page } from "./Page";
import { PageContainer } from "./PageContainer";
import { PageTitle } from "./PageTitle";
import { PageTitleText } from "./PageTitleText";

export interface PageFallbackProps {
  title: string;
  label?: string;
  errors: Error[] | null;
  loading: boolean;
}

export const PageFallback = ({
  errors,
  loading,
  title,
  label = title,
}: PageFallbackProps) => {
  return (
    <Page title={title}>
      <PageTitle>
        <PageTitleText>{label}</PageTitleText>
      </PageTitle>
      <PageContainer>
        <Fallback errors={errors} loading={loading} />
      </PageContainer>
    </Page>
  );
};
