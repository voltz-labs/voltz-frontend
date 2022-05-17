import React, { useState } from "react";
import { ModalConfirm } from "../components/ModalConfirm";
import { nanoid } from "../functions/nanoid";
import { useHandler } from "../hooks/useHandler";

export interface ConfirmProps {
  id: string;
  message: string;
  onConfirm: () => Promise<void>;
  onClose: () => Promise<void>;
}

export type CreateConfirmProps = Omit<ConfirmProps, "id">;

export interface ConfirmContextProps {
  confirms: ConfirmProps[];
  createConfirm: (props: CreateConfirmProps) => void;
  deleteConfirm: (id: string) => void;
}

export const ConfirmContext = React.createContext<ConfirmContextProps>({
  confirms: [],
  createConfirm: () => {},
  deleteConfirm: () => {},
});

export const ConfirmContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [confirms, setConfirmes] = useState<ConfirmProps[]>([]);

  const createConfirm = ({ message, onClose, onConfirm }: CreateConfirmProps) =>
    setConfirmes((confirms) => [
      ...confirms,
      { id: nanoid(), message, onClose, onConfirm },
    ]);

  const deleteConfirm = (id: string) =>
    setConfirmes(confirms.filter((confirm) => confirm.id !== id));

  const { handler } = useHandler();

  return (
    <ConfirmContext.Provider
      value={{
        confirms,
        createConfirm,
        deleteConfirm,
      }}
    >
      {confirms.map((confirm, index) => (
        <ModalConfirm
          key={confirm.id}
          title="Confirm"
          onConfirm={handler(async () => {
            try {
              await confirm.onConfirm();
            } finally {
              deleteConfirm(confirm.id);
            }
          })}
          onClose={handler(async () => {
            try {
              await confirm.onClose();
            } finally {
              deleteConfirm(confirm.id);
            }
          })}
          show={index === 0}
        >
          <div>{confirm.message}</div>
        </ModalConfirm>
      ))}
      {children}
    </ConfirmContext.Provider>
  );
};
