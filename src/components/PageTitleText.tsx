import { PropsWithChildren } from "react";

export const PageTitleText = ({ children }: PropsWithChildren<{}>) => {
  return <h2>{children}</h2>;
};
