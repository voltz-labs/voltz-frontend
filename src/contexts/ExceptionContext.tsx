import React, { useState } from "react";
import { Modal } from "../components/Modal";
import { nanoid } from "../functions/nanoid";
import { parseError } from "../functions/parseError";

export interface ExceptionProps {
  id: string;
  error: Error;
}

export interface ExceptionContextProps {
  exceptions: ExceptionProps[];
  createException: (error: Error) => void;
  deleteException: (error: Error) => void;
}

export const ExceptionContext = React.createContext<ExceptionContextProps>({
  exceptions: [],
  createException: () => {},
  deleteException: () => {},
});

export const ExceptionContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [exceptions, setExceptions] = useState<ExceptionProps[]>([]);

  const createException = (error: Error) =>
    setExceptions((exceptions) => [...exceptions, { id: nanoid(), error }]);

  const deleteException = (error: Error) =>
    setExceptions(exceptions.filter((exception) => exception.error !== error));

  return (
    <ExceptionContext.Provider
      value={{
        exceptions,
        createException,
        deleteException,
      }}
    >
      {exceptions.map((exception, index) => (
        <Modal
          key={exception.id}
          title="Erro"
          onClose={() => deleteException(exception.error)}
          show={index === 0}
        >
          <pre style={{ maxHeight: "50vh" }}>
            <code>{JSON.stringify(parseError(exception.error), null, 2)}</code>
          </pre>
        </Modal>
      ))}
      {children}
    </ExceptionContext.Provider>
  );
};
