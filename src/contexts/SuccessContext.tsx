import React, { useState } from "react";
import { Modal } from "../components/Modal";
import { nanoid } from "../functions/nanoid";
import { useHandler } from "../hooks/useHandler";

export interface SuccessProps {
  id: string;
  message: string;
  onClose: () => Promise<void>;
}

export type CreateSuccessProps = Omit<SuccessProps, "id">;

export interface SuccessContextProps {
  successes: SuccessProps[];
  createSuccess: (props: CreateSuccessProps) => void;
  deleteSuccess: (id: string) => void;
}

export const SuccessContext = React.createContext<SuccessContextProps>({
  successes: [],
  createSuccess: () => {},
  deleteSuccess: () => {},
});

export const SuccessContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [sucesses, setSuccesses] = useState<SuccessProps[]>([]);

  const createSuccess = ({ message, onClose }: CreateSuccessProps) =>
    setSuccesses((successes) => [
      ...successes,
      { id: nanoid(), message, onClose },
    ]);

  const deleteSuccess = (id: string) =>
    setSuccesses(sucesses.filter((success) => success.id !== id));

  const { handler } = useHandler();

  return (
    <SuccessContext.Provider
      value={{
        successes: sucesses,
        createSuccess: createSuccess,
        deleteSuccess: deleteSuccess,
      }}
    >
      {sucesses.map((success, index) => (
        <Modal
          key={success.id}
          title="Sucess"
          onClose={handler(async () => {
            try {
              await success.onClose();
            } finally {
              deleteSuccess(success.id);
            }
          })}
          show={index === 0}
        >
          <div>{success.message}</div>
        </Modal>
      ))}
      {children}
    </SuccessContext.Provider>
  );
};
