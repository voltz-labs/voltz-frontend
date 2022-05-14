import { PropsWithChildren } from "react";

export const PageTitle = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="d-flex justify-content-between border-bottom mb-3 mt-5">
      {children}
    </div>
  );
};
