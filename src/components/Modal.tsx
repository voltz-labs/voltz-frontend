import React, { useEffect, useRef } from "react";
import { Button, Modal as BSModal } from "react-bootstrap";

export interface ModalProps {
  title: string;
  onClose: () => void;
  show: boolean;
}

export const Modal = ({
  children,
  title,
  onClose,
  show = true,
}: React.PropsWithChildren<ModalProps>) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref.current]);

  return (
    <>
      <BSModal
        show={show}
        onHide={() => onClose()}
        backdrop="static"
        keyboard={true}
        centered
        size="lg"
      >
        <BSModal.Header closeButton>
          <BSModal.Title>{title}</BSModal.Title>
        </BSModal.Header>
        <BSModal.Body>{children}</BSModal.Body>
        <BSModal.Footer>
          <Button ref={ref} variant="light" onClick={() => onClose()}>
            Close
          </Button>
        </BSModal.Footer>
      </BSModal>
    </>
  );
};
