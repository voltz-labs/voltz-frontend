import { PropsWithChildren } from "react";

export const PageTitle = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="d-flex justify-content-between border-bottom mb-3">
      {children}
    </div>
  );
};
