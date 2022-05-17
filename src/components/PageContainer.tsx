import { PropsWithChildren } from "react";

export const PageContainer = ({ children }: PropsWithChildren<{}>) => {
  return <div className="mt-3">{children}</div>;
};
