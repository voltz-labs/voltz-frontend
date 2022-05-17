import { PropsWithChildren } from "react";

export const PageTitle = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="d-flex justify-content-between border-bottom pb-3 pt-5">
      {children}
    </div>
  );
};
